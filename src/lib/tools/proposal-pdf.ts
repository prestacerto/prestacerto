import { PDFDocument, rgb, type PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { brandColors, formatMoney, proposalTotalCents, type BrandColor, type CommercialProposal } from './commercial-proposal';

let fontFiles: Promise<Buffer[]> | undefined;
function loadFonts() {
  return fontFiles ??= Promise.all([
    readFile(path.join(process.cwd(), 'src/assets/fonts/lato/Lato-Regular.ttf')),
    readFile(path.join(process.cwd(), 'src/assets/fonts/lato/Lato-Bold.ttf')),
  ]).catch(error => { fontFiles = undefined; throw error; });
}

export async function createProposalPdf(proposal: CommercialProposal, branded = false, color: BrandColor = 'blue') {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const files = await loadFonts();
  const regular = await doc.embedFont(files[0], { subset: true });
  const bold = await doc.embedFont(files[1], { subset: true });
  const allowed = new Set(regular.getCharacterSet());
  const clean = (value: string) => [...value.normalize('NFC')].map(char => allowed.has(char.codePointAt(0)!) ? char : char === '\n' ? '\n' : ' ').join('');
  const hex = brandColors[branded ? color : 'blue'];
  const accent = rgb(parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255);
  const ink = rgb(.08, .16, .28), muted = rgb(.34, .4, .48);
  let page = doc.addPage([595.28, 841.89]);
  let y = 785;
  const wrap = (text: string, size: number, font: PDFFont, width = 483) => {
    const lines: string[] = [];
    for (const paragraph of clean(text).split('\n')) {
      let line = '';
      for (const char of paragraph) {
        if (font.widthOfTextAtSize(line + char, size) > width) {
          const space = line.lastIndexOf(' ');
          if (space > line.length / 2) { lines.push(line.slice(0, space)); line = line.slice(space + 1) + char; }
          else { lines.push(line); line = char; }
        } else line += char;
      }
      lines.push(line);
    }
    return lines;
  };
  const ensure = (height: number) => { if (y - height < 72) { page = doc.addPage([595.28, 841.89]); y = 785; } };
  const text = (value: string, size = 11, font = regular, color = ink) => {
    for (const line of wrap(value, size, font)) {
      ensure(size + 7); page.drawText(line, { x: 56, y: y - size, size, font, color }); y -= size + 7;
    }
  };
  const section = (label: string) => { ensure(65); y -= 18; text(label.toUpperCase(), 9, bold, accent); y -= 5; };
  page.drawRectangle({ x: 0, y: 833, width: 595.28, height: 9, color: accent });
  text(branded ? proposal.provider : 'PrestaCerto', 19, bold, accent);
  y -= 12; text('PROPOSTA COMERCIAL', 9, bold, muted);
  text(proposal.title, 24, bold); y -= 12;
  text(`Preparada por: ${proposal.provider}`, 11);
  text(`Para: ${proposal.client}`, 11);
  section('Objetivo e escopo'); text(proposal.scope);
  section('Entregas e investimento');
  for (const item of proposal.items) {
    ensure(65);
    text(item.description, 11, bold);
    text(`${item.quantity} × ${formatMoney(Math.round(item.unitPrice * 100))}   |   ${formatMoney(Math.round(item.unitPrice * 100) * item.quantity)}`, 10, regular, muted);
    y -= 8;
  }
  ensure(55); y -= 6;
  page.drawRectangle({ x: 48, y: y - 35, width: 499, height: 43, color: rgb(.94, .96, .99) });
  text(`Investimento total: ${formatMoney(proposalTotalCents(proposal.items))}`, 16, bold, accent);
  y -= 8;
  section('Prazo e validade');
  text(`Entrega em ${proposal.deliveryDays} dias corridos após aprovação e recebimento dos materiais necessários.`);
  text(`Proposta válida por ${proposal.validDays} dias a partir do envio.`);
  section('Condições de pagamento'); text(proposal.paymentNotes);
  section('Próximo passo'); text('Confirme o escopo, o prazo e o investimento com o profissional para iniciar.');
  doc.getPages().forEach((p, i) => {
    p.drawLine({ start: { x: 56, y: 51 }, end: { x: 539, y: 51 }, thickness: .5, color: rgb(.85, .88, .92) });
    p.drawText(clean(branded ? proposal.provider : 'Criado com Certo Propostas | prestacerto.com.br'), { x: 56, y: 34, size: 8, font: regular, color: muted, maxWidth: 430 });
    p.drawText(`${i + 1} / ${doc.getPageCount()}`, { x: 510, y: 34, size: 8, font: regular, color: muted });
  });
  doc.setTitle(clean(proposal.title)); doc.setAuthor(clean(proposal.provider));
  doc.setCreator(branded ? 'Proposta comercial' : 'Certo Propostas — PrestaCerto');
  return doc.save();
}
