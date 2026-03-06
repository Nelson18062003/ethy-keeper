import { pdfToPng } from 'pdf-to-png-converter';
import path from 'path';

const PDF_PATH = path.join(process.cwd(), 'output', 'dashboard-soldes.pdf');
const OUTPUT_DIR = path.join(process.cwd(), 'output');

const pages = await pdfToPng(PDF_PATH, {
  disableFontFace: false,
  useSystemFonts: true,
  viewportScale: 3,
  outputFolder: undefined,
  pages: [1],
});

import fs from 'fs';
const outputPath = path.join(OUTPUT_DIR, 'dashboard-soldes.png');
fs.writeFileSync(outputPath, pages[0].content);
console.log(`✅ PNG generated successfully: ${outputPath}`);
