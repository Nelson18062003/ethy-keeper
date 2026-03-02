import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// ── Page Constants ─────────────────────────────────────
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

// ── Colors ─────────────────────────────────────────────
const BG_COLOR = '#0F1117';
const CARD_BG = '#1A1D27';
const CARD_BG_ZERO = '#13151E';
const CARD_BORDER = '#2A2D37';
const TEXT_WHITE = '#FFFFFF';
const TEXT_MUTED = '#8892A8';
const TEXT_DIMMED = '#4A5068';
const TEXT_VERY_DIM = '#3A3F50';
const GRADIENT_START = '#7C3AED';
const GRADIENT_END = '#3B82F6';
const GREEN_ACCENT = '#10B981';

// ── Layout ─────────────────────────────────────────────
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const CARD_GAP = 16;
const CARD_WIDTH = (CONTENT_WIDTH - CARD_GAP) / 2;
const CARD_HEIGHT = 130;
const CARD_RADIUS = 12;

// ── Account Data ───────────────────────────────────────
const accounts = [
  { name: 'MTN MoMo', type: 'Mobile Money', balance: 3700000, color: '#FFCC00', initials: 'M' },
  { name: 'Orange Money', type: 'Mobile Money', balance: 3000000, color: '#FF6600', initials: 'O' },
  { name: 'UBA Cameroun', type: 'Banque', balance: 3489450, color: '#E31837', initials: 'U' },
  { name: 'Afriland First Bank', type: 'Banque', balance: 18360220, color: '#8B0000', initials: 'A' },
  { name: 'Ecobank Cameroun', type: 'Banque', balance: 0, color: '#0066B3', initials: 'E' },
  { name: 'CCA-Bank', type: 'Banque', balance: 0, color: '#6A0DAD', initials: 'C' },
];

const TOTAL = accounts.reduce((s, a) => s + a.balance, 0);

// ── Color Utilities ────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}

function lerpColor(c1, c2, t) {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

function isLight(hex) {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

function formatXAF(n) {
  if (n === 0) return '0';
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// ── Drawing Helpers ────────────────────────────────────
function drawGradientLine(doc, x, y, width, height, c1, c2) {
  const steps = 80;
  const sw = width / steps;
  for (let i = 0; i < steps; i++) {
    doc.rect(x + i * sw, y, sw + 0.5, height).fill(lerpColor(c1, c2, i / steps));
  }
}

function drawRoundedRect(doc, x, y, w, h, r) {
  doc.moveTo(x + r, y)
    .lineTo(x + w - r, y)
    .quadraticCurveTo(x + w, y, x + w, y + r)
    .lineTo(x + w, y + h - r)
    .quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    .lineTo(x + r, y + h)
    .quadraticCurveTo(x, y + h, x, y + h - r)
    .lineTo(x, y + r)
    .quadraticCurveTo(x, y, x + r, y)
    .closePath();
}

function fillRoundedRect(doc, x, y, w, h, r, color) {
  doc.save();
  drawRoundedRect(doc, x, y, w, h, r);
  doc.fill(color);
  doc.restore();
}

function strokeRoundedRect(doc, x, y, w, h, r, color, lineWidth) {
  doc.save();
  drawRoundedRect(doc, x, y, w, h, r);
  doc.lineWidth(lineWidth).strokeColor(color).stroke();
  doc.restore();
}

// ── Section Drawers ────────────────────────────────────

function drawBackground(doc) {
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(BG_COLOR);
}

function drawHeader(doc) {
  // Title
  doc.font('Helvetica-Bold').fontSize(24).fillColor(TEXT_WHITE);
  doc.text('SOLDE DE MES COMPTES', MARGIN, 44, { width: CONTENT_WIDTH, align: 'center' });

  // Date
  const dateStr = 'Situation au 02 mars 2026';
  doc.font('Helvetica').fontSize(11).fillColor(TEXT_MUTED);
  doc.text(dateStr, MARGIN, 76, { width: CONTENT_WIDTH, align: 'center' });

  // Gradient separator
  drawGradientLine(doc, MARGIN, 98, CONTENT_WIDTH, 2, GRADIENT_START, GRADIENT_END);
}

function drawAccountCard(doc, account, x, y) {
  const isZero = account.balance === 0;

  // Card background
  fillRoundedRect(doc, x, y, CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS, isZero ? CARD_BG_ZERO : CARD_BG);
  strokeRoundedRect(doc, x, y, CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS, CARD_BORDER, 0.5);

  // Left accent bar
  const accentColor = isZero ? lerpColor(account.color, '#000000', 0.5) : account.color;
  fillRoundedRect(doc, x + 8, y + 14, 3, CARD_HEIGHT - 28, 1.5, accentColor);

  // Logo circle
  const cx = x + 38;
  const cy = y + 40;
  const r = 18;
  const circleBg = isZero ? lerpColor(account.color, '#000000', 0.4) : account.color;
  doc.circle(cx, cy, r).fill(circleBg);

  // Logo letter
  const letterColor = isLight(account.color) ? '#000000' : '#FFFFFF';
  doc.font('Helvetica-Bold').fontSize(18).fillColor(letterColor);
  const lw = doc.widthOfString(account.initials);
  doc.text(account.initials, cx - lw / 2, cy - 7, { lineBreak: false });

  // Account name
  doc.font('Helvetica-Bold').fontSize(13).fillColor(isZero ? TEXT_DIMMED : TEXT_WHITE);
  doc.text(account.name, x + 64, y + 20, { width: CARD_WIDTH - 76, lineBreak: false });

  // Type badge
  const isMobile = account.type === 'Mobile Money';
  const badgeBg = isMobile ? '#1E3A2F' : '#1E2A3A';
  const badgeTextColor = isMobile ? '#4ADE80' : '#60A5FA';
  const badgeLabel = isMobile ? 'Mobile Money' : 'Banque';

  doc.font('Helvetica').fontSize(8);
  const btw = doc.widthOfString(badgeLabel);
  const bw = btw + 24;
  const bh = 16;
  const bx = x + 64;
  const by = y + 42;
  fillRoundedRect(doc, bx, by, bw, bh, 4, badgeBg);
  // Small dot indicator
  doc.circle(bx + 8, by + 8, 2.5).fill(badgeTextColor);
  doc.font('Helvetica').fontSize(8).fillColor(badgeTextColor);
  doc.text(badgeLabel, bx + 15, by + 4, { lineBreak: false });

  // Balance
  const balStr = formatXAF(account.balance);
  const balY = y + CARD_HEIGHT - 34;
  doc.font('Helvetica-Bold').fontSize(18).fillColor(isZero ? TEXT_DIMMED : TEXT_WHITE);
  doc.text(balStr, x + 20, balY, { lineBreak: false, continued: false });

  // "XAF" suffix
  doc.font('Helvetica-Bold').fontSize(18);
  const balWidth = doc.widthOfString(balStr);
  doc.font('Helvetica').fontSize(11).fillColor(isZero ? TEXT_VERY_DIM : TEXT_MUTED);
  doc.text(' XAF', x + 20 + balWidth + 4, balY + 3, { lineBreak: false });
}

function drawTotalSection(doc, startY) {
  // Gradient separator
  drawGradientLine(doc, MARGIN, startY, CONTENT_WIDTH, 2, GRADIENT_START, GRADIENT_END);

  // Total card background
  const cardY = startY + 20;
  const cardH = 120;
  fillRoundedRect(doc, MARGIN, cardY, CONTENT_WIDTH, cardH, CARD_RADIUS, '#111827');
  strokeRoundedRect(doc, MARGIN, cardY, CONTENT_WIDTH, cardH, CARD_RADIUS, '#1F2937', 1);

  // Inner glow effect (subtle green-tinted top border)
  fillRoundedRect(doc, MARGIN + 1, cardY + 1, CONTENT_WIDTH - 2, 3, CARD_RADIUS, lerpColor(GREEN_ACCENT, '#111827', 0.7));

  // "SOLDE TOTAL" label
  doc.font('Helvetica').fontSize(12).fillColor(TEXT_MUTED);
  doc.text('SOLDE TOTAL', MARGIN, cardY + 24, { width: CONTENT_WIDTH, align: 'center' });

  // Total amount
  const totalStr = formatXAF(TOTAL);
  doc.font('Helvetica-Bold').fontSize(32).fillColor(TEXT_WHITE);
  doc.text(totalStr, MARGIN, cardY + 48, { width: CONTENT_WIDTH, align: 'center', continued: false });

  // "XAF" below
  doc.font('Helvetica').fontSize(14).fillColor(GREEN_ACCENT);
  doc.text('XAF', MARGIN, cardY + 86, { width: CONTENT_WIDTH, align: 'center' });

  // Green underline accent
  const ulW = 80;
  const ulX = (PAGE_WIDTH - ulW) / 2;
  fillRoundedRect(doc, ulX, cardY + cardH - 8, ulW, 3, 1.5, GREEN_ACCENT);
}

function drawFooter(doc) {
  doc.font('Helvetica').fontSize(8).fillColor(TEXT_VERY_DIM);
  doc.text('Document genere automatiquement  -  ethy-keeper  -  02/03/2026', MARGIN, PAGE_HEIGHT - 30, {
    width: CONTENT_WIDTH,
    align: 'center',
  });
}

// ── Main ───────────────────────────────────────────────
function generatePDF() {
  const outputDir = path.join(process.cwd(), 'output');
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, 'dashboard-soldes.pdf');

  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    info: {
      Title: 'Solde de mes comptes',
      Author: 'ethy-keeper',
      Subject: 'Tableau de bord des soldes bancaires',
      CreationDate: new Date(),
    },
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // 1. Background
  drawBackground(doc);

  // 2. Header
  drawHeader(doc);

  // 3. Account cards (2 columns, 3 rows)
  const gridStartY = 116;
  for (let i = 0; i < accounts.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = MARGIN + col * (CARD_WIDTH + CARD_GAP);
    const cy = gridStartY + row * (CARD_HEIGHT + CARD_GAP);
    drawAccountCard(doc, accounts[i], cx, cy);
  }

  // 4. Total section
  const lastCardBottom = gridStartY + 2 * (CARD_HEIGHT + CARD_GAP) + CARD_HEIGHT;
  const totalSectionY = lastCardBottom + 30;
  drawTotalSection(doc, totalSectionY);

  // 5. Footer
  drawFooter(doc);

  doc.end();

  stream.on('finish', () => {
    console.log(`\u2705 PDF g\u00e9n\u00e9r\u00e9 avec succ\u00e8s : ${outputPath}`);
  });
}

generatePDF();
