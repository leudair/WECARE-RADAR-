import { jsPDF } from "jspdf";
import JSZip from "jszip";
import type { ExportEntry } from "./types";

export const SAFE_RHYTHM_TITLE = "Como usar sem bloquear sua conta";
export const SAFE_RHYTHM_LINES = [
  "Deixe de seguir no máximo 20 contas por hora e 100 por dia.",
  "Faça pausas entre os blocos.",
  "Confira antes de remover — algumas dessas contas você pode querer continuar seguindo mesmo sem reciprocidade.",
];

export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];
  const blocks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    blocks.push(items.slice(i, i + size));
  }
  return blocks;
}

const MARGIN = 48;
const PAGE_WIDTH = 595.28; // A4 pt
const PAGE_HEIGHT = 841.89;
const LINE_HEIGHT = 18;

function newDoc(): jsPDF {
  return new jsPDF({ unit: "pt", format: "a4" });
}

function drawHeader(doc: jsPDF, clientName: string, blockIndex: number, blockCount: number): number {
  let y = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("WeCare Radar — Contas sem reciprocidade", MARGIN, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Cliente: ${clientName || "—"}`, MARGIN, y);
  y += 16;
  doc.text(`Bloco ${blockIndex} de ${blockCount}`, MARGIN, y);
  y += 20;

  doc.setDrawColor(200);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 20;
  return y;
}

function drawFooterInstructions(doc: jsPDF) {
  const y0 = PAGE_HEIGHT - MARGIN - (SAFE_RHYTHM_LINES.length + 1) * 13 - 10;
  doc.setDrawColor(200);
  doc.line(MARGIN, y0 - 10, PAGE_WIDTH - MARGIN, y0 - 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(SAFE_RHYTHM_TITLE, MARGIN, y0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  SAFE_RHYTHM_LINES.forEach((line, i) => {
    doc.text(`• ${line}`, MARGIN, y0 + 13 * (i + 1), { maxWidth: PAGE_WIDTH - MARGIN * 2 });
  });
}

export function buildBlockPdf(params: {
  clientName: string;
  blockIndex: number;
  blockCount: number;
  offset: number;
  entries: ExportEntry[];
}): Blob {
  const { clientName, blockIndex, blockCount, offset, entries } = params;
  const doc = newDoc();
  let y = drawHeader(doc, clientName, blockIndex, blockCount);
  const footerStartsAt = PAGE_HEIGHT - MARGIN - (SAFE_RHYTHM_LINES.length + 1) * 13 - 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);

  entries.forEach((entry, i) => {
    if (y > footerStartsAt) {
      drawFooterInstructions(doc);
      doc.addPage();
      y = drawHeader(doc, clientName, blockIndex, blockCount);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
    }
    const number = offset + i + 1;
    doc.textWithLink(`${number}. @${entry.username}`, MARGIN, y, { url: entry.href });
    y += LINE_HEIGHT;
  });

  drawFooterInstructions(doc);
  return doc.output("blob");
}

export function buildSamplePdf(params: { clientName: string; entries: ExportEntry[] }): Blob {
  const { clientName, entries } = params;
  const doc = newDoc();
  let y = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("WeCare Radar — Amostra grátis", MARGIN, y);
  y += 24;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Cliente: ${clientName || "—"}`, MARGIN, y);
  y += 16;
  doc.text(`${entries.length} de ${entries.length} contas da amostra (sem reciprocidade)`, MARGIN, y);
  y += 24;
  doc.setDrawColor(200);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 20;

  doc.setFontSize(10.5);
  entries.forEach((entry, i) => {
    doc.textWithLink(`${i + 1}. @${entry.username}`, MARGIN, y, { url: entry.href });
    y += LINE_HEIGHT;
  });

  return doc.output("blob");
}

export async function buildAllBlocksZip(blocks: { name: string; blob: Blob }[]): Promise<Blob> {
  const zip = new JSZip();
  for (const block of blocks) {
    zip.file(block.name, block.blob);
  }
  return zip.generateAsync({ type: "blob" });
}
