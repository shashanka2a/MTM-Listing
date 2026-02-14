import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Analysis prompt for model train listings - comprehensive for eBay/SixBit export
const ANALYSIS_PROMPT = `You are an expert model train appraiser. Analyze the provided images and extract detailed information for an eBay listing.

SCALE IDENTIFICATION (use size, track, and visual cues — do not guess):
- Z Scale (1:220): Extremely small — locomotive ~2 inches (pinky-sized). Track 6.5mm. Couplers often look oversized vs body. Smallest common scale.
- N Scale (1:160): Car ~AA battery size; engine fits between thumb and forefinger. Track 9mm. "N" = nine millimeter. Popular for small layouts.
- HO Scale (1:87): Locomotive ~6–8 inches (smartphone length). Track 16.5mm. Most common worldwide; generic hobby-shop / starter-set scale. Balance of detail and size.
- S Scale (1:64): Between HO and O; same size as Hot Wheels/Matchbox. Track 22.5mm. Often American Flyer; two-rail (not three-rail).
- O Scale (1:48): Large — loco 10–12 inches, heavy. Track 32mm. KEY: three rails (center power rail) = Lionel/O gauge. Nostalgic, robust.
- G Scale (1:22.5): Garden scale — loco shoebox/loaf-sized, rugged, often outdoor. Track 45mm. Built for weather; UV-resistant plastic common.

If track is visible: three rails → O. Two rails very narrow → Z or N. Two rails medium → HO or S. Two rails wide → O or G. Use relative size of the model (vs box, hands, or known objects) to choose scale when gauge is unclear.

Examine ALL images thoroughly: model (logos, numbers, wheels), boxes (brand, model#, scale), packaging, and any paperwork (manuals, instructions, certificates, warranty cards, decoder docs, etc.). Look at every photo for paperwork — if any image shows paperwork, set paperwork to true.

WHEEL WEAR: Look at the wheels in the images. Assess wear from color (darkening, rust), dirt, and corrosion. Return exactly one of: "Very little", "Minor", "Moderate", "Heavy". Very little = like new; Minor = light discoloration or dust; Moderate = visible wear/dirt/corrosion; Heavy = significant wear, heavy corrosion, or heavy dirt.

PAPERWORK: Only set to false if no paperwork is visible in any image. If you see manuals, instructions, certificates, warranty cards, or any documentation in any photo, set paperwork to true.

Return ONLY a valid JSON object (no markdown, no explanation) with these exact fields:

{
  "title": "Complete eBay title: [Scale] [Brand] [Product Line] [Road Name] [Type] #[Road Number] [Key Features]",
  "brand": "Exact manufacturer name (Athearn, Bachmann, Kato, Atlas, MTH, Lionel, Broadway Limited, ScaleTrains, Walthers, Proto 2000, American Flyer, etc.)",
  "line": "Product line if visible (Genesis, Executive, Trainman, Spectrum, etc.)",
  "scale": "Exactly one of: Z, N, HO, S, O, G — use the identification guide above",
  "gauge": "Track gauge in mm if known: 6.5 (Z), 9 (N), 16.5 (HO), 22.5 (S), 32 (O), 45 (G); else same as scale name",
  "locomotiveType": "Specific type: Diesel Locomotive, Steam Locomotive, Electric Locomotive, Boxcar, Tank Car, Hopper, Gondola, Flat Car, Caboose, Passenger Car, etc.",
  "roadName": "Full railroad name: Union Pacific, BNSF Railway, Norfolk Southern, CSX, Santa Fe, Pennsylvania Railroad, etc. (Reporting marks like BN, UP, BNSF are 2–4 letter codes on the model; use them to identify the railroad but put the full name here.)",
  "roadNumber": "ONLY the numeric part of the number on the equipment. Do NOT include the Reporting Mark (the 2–4 letter code). Example: if the model shows BN1574, roadNumber is \"1574\". Example: UP 1234 → roadNumber is \"1234\".",
  "modelNumber": "Manufacturer's catalog/product number from box or item",
  "dcc": "One of: DCC with Sound, DCC Equipped, DCC Ready, Analog Only, Unknown",
  "decoderBrand": "If DCC: decoder brand (ESU LokSound, Tsunami, Digitrax, etc.) or null",
  "condition": 8,
  "conditionNotes": "Detailed condition description for seller notes (2-3 sentences)",
  "packaging": "One of: Original Box Mint, Original Box Good, Original Box Fair, Original Box Poor, No Original Box",
  "paperwork": true,
  "wheelWear": "Exactly one of: Very little, Minor, Moderate, Heavy — based on wheel appearance (color, dirt, corrosion) in the images",
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
  "description": "Full eBay description paragraph (3-4 sentences) describing the item professionally; include scale and ratio (e.g. HO 1:87) when known.",
  "estimatedValue": "Market value estimate as number only (e.g., 45)",
  "confidence": 85
}

RULES:
1. Identify scale using the guide: size vs real-world reference, track gauge (2 vs 3 rails, width), and visual cues. Prefer scale printed on box if visible.
2. For condition: 10=Mint/Sealed, 9=Like New, 8=Excellent, 7=Very Good, 6=Good, 5=Fair, 4-1=Poor to Junk
3. Always provide the title in proper eBay format with correct scale
4. features array: 3-6 specific items; defects can be [] if none
5. Use full road names in roadName, not just initials. Reporting marks (2–4 letter codes, e.g. BN, UP, BNSF) go with the railroad name; do not put them in roadNumber.
6. roadNumber = digits only. If you see \"BN1574\" or \"UP 1234\" on the model, roadNumber is \"1574\" or \"1234\" respectively.
7. wheelWear: Inspect the WHEELS in the images. Use color (darkening, rust), dirt, and corrosion to choose Very little / Minor / Moderate / Heavy. Do not leave blank if wheels are visible.
8. paperwork: Scan every image for any paperwork (manuals, instructions, certificates, docs). If any photo shows paperwork, set paperwork to true. Only false when no paperwork appears in any image.
9. confidence: higher when scale/box is clearly visible, lower when scale is inferred from size only`;

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
