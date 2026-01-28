export interface ListingImage {
  url: string;
  publicId?: string;
}

export interface ListingData {
  sku: string;
  title: string;
  condition: string;
  scale: string;
  brand: string;
  dcc: string;
  weight: string;
  status: string;
  vendor?: string;
  images?: ListingImage[];
  description?: string;
  roadName?: string;
  roadNumber?: string;
  locomotiveType?: string;
}

export function generateSixBitCSV(listings: ListingData[]): string {
  // SixBit CSV Headers - including image URLs
  const headers = [
    'ItemNumber',
    'Title',
    'ConditionCode',
    'Brand',
    'Scale',
    'Gauge',
    'DCC',
    'Weight',
    'Status',
    'Vendor',
    'Description',
    'RoadName',
    'RoadNumber',
    'LocomotiveType',
    'ImageURL1',
    'ImageURL2',
    'ImageURL3',
    'ImageURL4',
    'ImageURL5',
  ];

  // Convert listings to CSV rows
  const rows = listings.map(listing => {
    // Get up to 5 image URLs
    const imageUrls = listing.images?.slice(0, 5).map(img => img.url) || [];
    while (imageUrls.length < 5) {
      imageUrls.push(''); // Pad with empty strings
    }

    return [
      listing.sku,
      `"${(listing.title || '').replace(/"/g, '""')}"`, // Escape quotes in title
      listing.condition,
      listing.brand || '',
      listing.scale || '',
      listing.scale || '', // Gauge same as scale for model trains
      listing.dcc || '',
      listing.weight || '',
      listing.status || '',
      listing.vendor || '',
      `"${(listing.description || '').replace(/"/g, '""')}"`,
      listing.roadName || '',
      listing.roadNumber || '',
      listing.locomotiveType || '',
      ...imageUrls,
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSV(csvContent: string, filename: string = 'sixbit-export.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function generateSixBitXML(listings: ListingData[]): string {
  const xmlItems = listings.map(listing => {
    // Generate image tags
    const imageTags = listing.images?.slice(0, 5).map((img, index) => 
      `      <ImageURL${index + 1}>${img.url}</ImageURL${index + 1}>`
    ).join('\n') || '';

    return `
    <Item>
      <ItemNumber>${escapeXml(listing.sku)}</ItemNumber>
      <Title><![CDATA[${listing.title || ''}]]></Title>
      <ConditionCode>${escapeXml(listing.condition)}</ConditionCode>
      <Brand>${escapeXml(listing.brand || '')}</Brand>
      <Scale>${escapeXml(listing.scale || '')}</Scale>
      <Gauge>${escapeXml(listing.scale || '')}</Gauge>
      <DCC>${escapeXml(listing.dcc || '')}</DCC>
      <Weight>${escapeXml(listing.weight || '')}</Weight>
      <Status>${escapeXml(listing.status || '')}</Status>
      ${listing.vendor ? `<Vendor>${escapeXml(listing.vendor)}</Vendor>` : ''}
      <Description><![CDATA[${listing.description || ''}]]></Description>
      <RoadName>${escapeXml(listing.roadName || '')}</RoadName>
      <RoadNumber>${escapeXml(listing.roadNumber || '')}</RoadNumber>
      <LocomotiveType>${escapeXml(listing.locomotiveType || '')}</LocomotiveType>
${imageTags}
    </Item>`;
  }).join('\n');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<SixBitExport>
  <ExportDate>${new Date().toISOString()}</ExportDate>
  <TotalItems>${listings.length}</TotalItems>
  <Items>${xmlItems}
  </Items>
</SixBitExport>`;

  return xmlContent;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function downloadXML(xmlContent: string, filename: string = 'sixbit-export.xml') {
  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
