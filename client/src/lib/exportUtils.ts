import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { jsPDF } from "jspdf";

export async function exportToWord(
  content: Record<string, string>,
  items: Array<{ key: string; label: string }>
) {
  const sections: Paragraph[] = [];

  // Title
  sections.push(
    new Paragraph({
      text: "職務経歴書",
      heading: HeadingLevel.HEADING_1,
      spacing: {
        after: 400,
      },
    })
  );

  // Add each section
  items.forEach((item) => {
    const text = content[item.key];
    if (!text) return;

    sections.push(
      new Paragraph({
        text: item.label,
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200,
        },
      })
    );

    sections.push(
      new Paragraph({
        children: [new TextRun(text)],
        spacing: {
          after: 200,
        },
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

export function exportToPDF(
  content: Record<string, string>,
  items: Array<{ key: string; label: string }>
) {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;

  // Title
  doc.setFontSize(20);
  doc.text("職務経歴書", margin, yPosition);
  yPosition += 15;

  items.forEach((item) => {
    const text = content[item.key];
    if (!text) return;

    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Section title
    doc.setFontSize(14);
    doc.text(item.label, margin, yPosition);
    yPosition += 10;

    // Section content
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, doc.internal.pageSize.width - margin * 2);
    
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    yPosition += 5;
  });

  return doc;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * テキストファイル形式でエクスポート
 */
export function exportToText(
  content: Record<string, string>,
  items: Array<{ key: string; label: string }>
): Blob {
  let text = "職務経歴書\n";
  text += "=".repeat(50) + "\n\n";

  items.forEach((item) => {
    const itemContent = content[item.key];
    if (!itemContent) return;

    text += `【${item.label}】\n`;
    text += "-".repeat(50) + "\n";
    text += itemContent + "\n\n";
  });

  return new Blob([text], { type: "text/plain;charset=utf-8" });
}

/**
 * Markdown形式でエクスポート
 */
export function exportToMarkdown(
  content: Record<string, string>,
  items: Array<{ key: string; label: string }>
): Blob {
  let markdown = "# 職務経歴書\n\n";

  items.forEach((item) => {
    const itemContent = content[item.key];
    if (!itemContent) return;

    markdown += `## ${item.label}\n\n`;
    markdown += itemContent + "\n\n";
  });

  return new Blob([markdown], { type: "text/markdown;charset=utf-8" });
}
