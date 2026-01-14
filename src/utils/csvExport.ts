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
}

export function generateSixBitCSV(listings: ListingData[]): string {
  // SixBit CSV Headers
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
    'Vendor'
  ];

  // Convert listings to CSV rows
  const rows = listings.map(listing => [
    listing.sku,
    `"${listing.title}"`, // Quote title to handle commas
    listing.condition,
    listing.brand,
    listing.scale,
    listing.scale, // Gauge same as scale for model trains
    listing.dcc,
    listing.weight,
    listing.status,
    listing.vendor || ''
  ]);

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
  const xmlItems = listings.map(listing => `
    <Item>
      <ItemNumber>${listing.sku}</ItemNumber>
      <Title><![CDATA[${listing.title}]]></Title>
      <ConditionCode>${listing.condition}</ConditionCode>
      <Brand>${listing.brand}</Brand>
      <Scale>${listing.scale}</Scale>
      <Gauge>${listing.scale}</Gauge>
      <DCC>${listing.dcc}</DCC>
      <Weight>${listing.weight}</Weight>
      <Status>${listing.status}</Status>
      ${listing.vendor ? `<Vendor>${listing.vendor}</Vendor>` : ''}
    </Item>`).join('\n');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<SixBitExport>
  <ExportDate>${new Date().toISOString()}</ExportDate>
  <Items>
    ${xmlItems}
  </Items>
</SixBitExport>`;

  return xmlContent;
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
