import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Analysis prompt for model train listings - comprehensive for eBay/SixBit export
const ANALYSIS_PROMPT = `You are an expert model train appraiser specializing in HO, N, O, and G scale trains. Analyze the provided images carefully and extract detailed information for an eBay listing.

IMPORTANT: Examine ALL images thoroughly - look at:
- The model itself (logos, numbers, details)
- Any visible boxes (brand, model numbers, product info)
- Packaging condition
- Any paperwork or instructions visible

Return ONLY a valid JSON object (no markdown, no explanation) with these exact fields:

{
  "title": "Complete eBay title: [Scale] [Brand] [Product Line] [Road Name] [Type] #[Road Number] [Key Features]",
  "brand": "Exact manufacturer name (Athearn, Bachmann, Kato, Atlas, MTH, Lionel, Broadway Limited, ScaleTrains, Walthers, Proto 2000, etc.)",
  "line": "Product line if visible (Genesis, Executive, Trainman, Spectrum, etc.)",
  "scale": "Model scale: HO, N, O, G, Z, or S",
  "gauge": "Track gauge (usually same as scale for standard gauge)",
  "locomotiveType": "Specific type: Diesel Locomotive, Steam Locomotive, Electric Locomotive, Boxcar, Tank Car, Hopper, Gondola, Flat Car, Caboose, Passenger Car, etc.",
  "roadName": "Full railroad name: Union Pacific, BNSF Railway, Norfolk Southern, CSX, Santa Fe, Pennsylvania Railroad, etc.",
  "roadNumber": "The reporting marks and number (e.g., UP 1234, BNSF 5678)",
  "modelNumber": "Manufacturer's catalog/product number from box or item",
  "dcc": "One of: DCC with Sound, DCC Equipped, DCC Ready, Analog Only, Unknown",
  "decoderBrand": "If DCC: decoder brand (ESU LokSound, Tsunami, Digitrax, etc.) or null",
  "condition": 8,
  "conditionNotes": "Detailed condition description for seller notes (2-3 sentences)",
  "packaging": "One of: Original Box Mint, Original Box Good, Original Box Fair, Original Box Poor, No Original Box",
  "paperwork": true,
  "material": "Primary material: Plastic, Die-cast Metal, Brass, or Mixed",
  "couplerType": "Coupler type if visible: Knuckle, Horn-Hook, Kadee, McHenry, or Unknown",
  "features": [
    "List each notable feature as a separate item",
    "Examples: Metal wheels, Detailed underframe, See-through walkways, Factory weathering, LED lighting, Sprung trucks"
  ],
  "defects": [
    "List each defect or issue as a separate item",
    "Examples: Minor paint chip on roof, One coupler loose, Box has shelf wear"
  ],
  "description": "Full eBay description paragraph (3-4 sentences) describing the item professionally",
  "estimatedValue": "Market value estimate as number only (e.g., 45)",
  "confidence": 85
}

RULES:
1. For condition: 10=Mint/Sealed, 9=Like New, 8=Excellent, 7=Very Good, 6=Good, 5=Fair, 4-1=Poor to Junk
2. Always provide the title in proper eBay format
3. features array should have 3-6 specific items
4. defects array can be empty [] if item is perfect
5. Be specific with road names - use full names, not just initials
6. confidence should reflect how certain you are (higher if box is visible with clear info)`;

export async function POST(request: NextRequest) {
  try {
    const { imageUrls } = await request.json();

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'No image URLs provided' },
        { status: 400 }
      );
    }

    // Get the Gemini model for vision capabilities
    // Using gemini-2.5-flash for better availability
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Fetch images and convert to base64 for Gemini
    const imageParts = await Promise.all(
      imageUrls.slice(0, 5).map(async (url: string) => {
        try {
          // Handle both Cloudinary URLs and base64 data URLs
          if (url.startsWith('data:')) {
            // It's already base64
            const matches = url.match(/^data:(.+);base64,(.+)$/);
            if (matches) {
              return {
                inlineData: {
                  mimeType: matches[1],
                  data: matches[2],
                },
              };
            }
          }
          
          // Fetch the image from URL
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const mimeType = response.headers.get('content-type') || 'image/jpeg';
          
          return {
            inlineData: {
              mimeType,
              data: base64,
            },
          };
        } catch (error) {
          console.error('Error fetching image:', url, error);
          return null;
        }
      })
    );

    // Filter out any failed image fetches, with a type guard so TS knows nulls are removed
    const validImageParts = imageParts.filter(
      (part): part is { inlineData: { mimeType: string; data: string } } => part !== null
    );

    if (validImageParts.length === 0) {
      return NextResponse.json(
        { error: 'Could not process any images' },
        { status: 400 }
      );
    }

    // Call Gemini with images and prompt (with retry logic)
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await model.generateContent([
          ANALYSIS_PROMPT,
          ...validImageParts,
        ]);

        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        try {
          // Extract JSON from the response (it might be wrapped in markdown code blocks)
          let jsonStr = text;
          const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonStr = jsonMatch[1];
          }
          
          const analysis = JSON.parse(jsonStr);
          
          return NextResponse.json({
            success: true,
            analysis,
            rawResponse: text,
          });
        } catch (parseError) {
          console.error('Error parsing Gemini response:', parseError);
          return NextResponse.json({
            success: true,
            analysis: null,
            rawResponse: text,
            parseError: 'Could not parse structured response',
          });
        }
      } catch (error: any) {
        lastError = error;
        console.error(`Gemini API attempt ${attempt + 1} failed:`, error.message || error);
        
        // Check if it's a retryable error (503, 429, etc.)
        if (error.status === 503 || error.status === 429 || error.message?.includes('overloaded')) {
          // Wait before retrying (exponential backoff)
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // Non-retryable error, break out
        break;
      }
    }
    
    console.error('Gemini API error after retries:', lastError);
    return NextResponse.json(
      { error: 'Failed to analyze images', details: String(lastError) },
      { status: 500 }
    );
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze images', details: String(error) },
      { status: 500 }
    );
  }
}
