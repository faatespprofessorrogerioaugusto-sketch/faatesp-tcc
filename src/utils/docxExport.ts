import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  HeadingLevel,
  TabStopType,
  TabStopPosition,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { TccDocument } from '../types';
import { getFichaCatalograficaContent } from './abntFormatter';

export async function exportTccToDocx(doc: TccDocument): Promise<Blob> {
  const font = doc.fontType; // 'Arial' or 'Times New Roman'

  // A4 Margins in twips/dxa:
  // 3 cm = 1700.78 dxa ~ 1701 dxa
  // 2 cm = 1133.85 dxa ~ 1134 dxa
  const margins = {
    top: 1701,
    left: 1701,
    bottom: 1134,
    right: 1134,
  };

  const { preTextual, chapters, references } = doc;

  // Helper for normal paragraph (12pt, 1.5 line spacing, 1.25 cm indent)
  const createNormalParagraph = (text: string, bold = false) => {
    return new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 360, before: 120, after: 120 }, // line 360 = 1.5 line spacing
      indent: { firstLine: 709 }, // 709 dxa = 1.25 cm
      children: [
        new TextRun({
          text,
          font,
          size: 24, // 24 half-pts = 12pt
          bold,
        }),
      ],
    });
  };

  // Helper for Section Heading (12pt BOLD UPPERCASE)
  const createHeading = (title: string) => {
    return new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 360, after: 240 },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          font,
          size: 24,
          bold: true,
        }),
      ],
    });
  };

  // Helper for Subheading (12pt Bold)
  const createSubHeading = (num: string, title: string) => {
    return new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 240, after: 180 },
      children: [
        new TextRun({
          text: `${num} ${title}`,
          font,
          size: 24,
          bold: true,
        }),
      ],
    });
  };

  // Section 1: Pre-Textual Elements (No page numbers displayed in Word header)
  const preTextualChildren: Paragraph[] = [];

  // CAPA
  preTextualChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 },
      children: [new TextRun({ text: (preTextual.instituicao || '').toUpperCase(), font, size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 1440 },
      children: [new TextRun({ text: (preTextual.curso || '').toUpperCase(), font, size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 720, after: 1440 },
      children: [new TextRun({ text: (preTextual.autor || '').toUpperCase(), font, size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1440, after: 240 },
      children: [new TextRun({ text: (preTextual.titulo || 'TRABALHO DE CONCLUSÃO DE CURSO').toUpperCase(), font, size: 28, bold: true })],
    })
  );

  if (preTextual.subtitulo) {
    preTextualChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 1440 },
        children: [new TextRun({ text: preTextual.subtitulo, font, size: 24, italics: true })],
      })
    );
  }

  preTextualChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 2160, after: 0 },
      children: [
        new TextRun({ text: `${(preTextual.cidade || '').toUpperCase()}\n${preTextual.ano || ''}`, font, size: 24, bold: true }),
      ],
    })
  );

  // Page Break after Capa
  preTextualChildren.push(new Paragraph({ pageBreakBefore: true }));

  // FOLHA DE ROSTO
  preTextualChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 1440 },
      children: [new TextRun({ text: (preTextual.autor || '').toUpperCase(), font, size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1440, after: 1440 },
      children: [new TextRun({ text: (preTextual.titulo || 'TRABALHO DE CONCLUSÃO DE CURSO').toUpperCase(), font, size: 28, bold: true })],
    }),
    // Natureza do trabalho (indent 8 cm left, font 10pt, single line spacing)
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 4535 }, // ~8 cm
      spacing: { line: 240, before: 1440, after: 360 }, // single spacing = 240
      children: [
        new TextRun({
          text: preTextual.naturezaTrabalho || '',
          font,
          size: 20, // 10pt
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 4535 },
      spacing: { line: 240, before: 120, after: 1440 },
      children: [
        new TextRun({ text: `Orientador: ${preTextual.orientador || ''}`, font, size: 20, bold: true }),
        preTextual.coorientador
          ? new TextRun({ text: `\nCoorientador: ${preTextual.coorientador}`, font, size: 20 })
          : new TextRun({ text: '' }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1440, after: 0 },
      children: [
        new TextRun({ text: `${(preTextual.cidade || '').toUpperCase()}\n${preTextual.ano || ''}`, font, size: 24, bold: true }),
      ],
    })
  );

  // FICHA CATALOGRÁFICA (VERSO DA FOLHA DE ROSTO - ABNT NBR 14724)
  const ficha = getFichaCatalograficaContent(preTextual);
  if (ficha.incluirFicha) {
    preTextualChildren.push(new Paragraph({ pageBreakBefore: true }));

    // Empty space pushing card to bottom of page
    preTextualChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 3000, after: 240 },
        children: [],
      })
    );

    const mainCellChildren = [
      new Paragraph({
        spacing: { line: 280, before: 100, after: 100 },
        children: [new TextRun({ text: ficha.autorCatalog, font, size: 20 })],
      }),
      new Paragraph({
        spacing: { line: 280, before: 100, after: 100 },
        children: [new TextRun({ text: ficha.tituloCompleto, font, size: 20 })],
      }),
      new Paragraph({
        spacing: { line: 280, before: 100, after: 100 },
        children: [new TextRun({ text: ficha.orientacao, font, size: 20 })],
      }),
    ];

    if (ficha.coorientacao) {
      mainCellChildren.push(
        new Paragraph({
          spacing: { line: 280, before: 100, after: 100 },
          children: [new TextRun({ text: ficha.coorientacao, font, size: 20 })],
        })
      );
    }

    mainCellChildren.push(
      new Paragraph({
        spacing: { line: 280, before: 100, after: 100 },
        children: [new TextRun({ text: ficha.cidadeAno, font, size: 20 })],
      }),
      new Paragraph({
        spacing: { line: 280, before: 100, after: 100 },
        children: [new TextRun({ text: ficha.numeroPaginas, font, size: 20 })],
      }),
      new Paragraph({
        spacing: { line: 280, before: 100, after: 100 },
        children: [new TextRun({ text: ficha.naturezaTrabalho, font, size: 20 })],
      }),
      new Paragraph({
        spacing: { line: 280, before: 100, after: 100 },
        children: [new TextRun({ text: ficha.palavrasChaveTexto, font, size: 20 })],
      })
    );

    const fichaTable = new Table({
      width: { size: 90, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      rows: [
        // Row 1: Header Box
        new TableRow({
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
                bottom: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
                left: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
                right: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
              },
              margins: { top: 120, bottom: 120, left: 200, right: 200 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'FICHA CATALOGRÁFICA',
                      font,
                      size: 22,
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Row 2: Main Content Box
        new TableRow({
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: '000000' },
                bottom: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
                left: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
                right: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
              },
              margins: { top: 200, bottom: 200, left: 240, right: 240 },
              children: mainCellChildren,
            }),
          ],
        }),
      ],
    });

    preTextualChildren.push(fichaTable as any);
  }

  // FOLHA DE APROVAÇÃO
  preTextualChildren.push(new Paragraph({ pageBreakBefore: true }));
  preTextualChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 720 },
      children: [new TextRun({ text: (preTextual.autor || '').toUpperCase(), font, size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 720, after: 720 },
      children: [new TextRun({ text: (preTextual.titulo || 'TRABALHO DE CONCLUSÃO DE CURSO').toUpperCase(), font, size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 720, after: 360 },
      children: [new TextRun({ text: 'BANCA EXAMINADORA', font, size: 24, bold: true })],
    })
  );

  const bancaMembers = (preTextual.membrosBanca && preTextual.membrosBanca.length > 0)
    ? preTextual.membrosBanca
    : [
        { id: '1', name: preTextual.orientador || 'Prof. Orientador', title: 'Orientador - Presidente', institution: preTextual.instituicao || '' },
      ];

  bancaMembers.forEach((m) => {
    preTextualChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 720, after: 120 },
        children: [
          new TextRun({ text: '_____________________________________________\n', font, size: 24 }),
          new TextRun({ text: `${m.name}\n`, font, size: 24, bold: true }),
          new TextRun({ text: `${m.title} - ${m.institution}`, font, size: 20 }),
        ],
      })
    );
  });

  // RESUMO
  preTextualChildren.push(new Paragraph({ pageBreakBefore: true }));
  preTextualChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 360 },
      children: [new TextRun({ text: 'RESUMO', font, size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 240, before: 120, after: 240 }, // single spacing
      children: [new TextRun({ text: preTextual.resumo?.texto || '', font, size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 240, after: 240 },
      children: [
        new TextRun({ text: 'Palavras-chave: ', font, size: 24, bold: true }),
        new TextRun({ text: (preTextual.resumo?.palavrasChave || []).join(' '), font, size: 24 }),
      ],
    })
  );

  // ABSTRACT
  preTextualChildren.push(new Paragraph({ pageBreakBefore: true }));
  preTextualChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 360 },
      children: [new TextRun({ text: 'ABSTRACT', font, size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 240, before: 120, after: 240 },
      children: [new TextRun({ text: preTextual.abstract?.texto || '', font, size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 240, after: 240 },
      children: [
        new TextRun({ text: 'Keywords: ', font, size: 24, bold: true }),
        new TextRun({ text: (preTextual.abstract?.keywords || []).join(' '), font, size: 24 }),
      ],
    })
  );

  // SUMÁRIO
  preTextualChildren.push(new Paragraph({ pageBreakBefore: true }));
  preTextualChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 480 },
      children: [new TextRun({ text: 'SUMÁRIO', font, size: 24, bold: true })],
    })
  );

  (chapters || []).forEach((ch) => {
    preTextualChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: 'dot' as any }],
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({ text: `${ch.number} ${(ch.title || '').toUpperCase()}`, font, size: 24, bold: true }),
        ],
      })
    );
    (ch.subsections || []).forEach((sub) => {
      preTextualChildren.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          indent: { left: 360 },
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({ text: `${sub.number} ${sub.title || ''}`, font, size: 24 }),
          ],
        })
      );
    });
  });

  preTextualChildren.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 120, after: 120 },
      children: [new TextRun({ text: 'REFERÊNCIAS', font, size: 24, bold: true })],
    })
  );

  // Section 2: Textual Elements (CHAPTERS) -> Header includes Arabic Page Numbers on Top Right!
  const textualChildren: Paragraph[] = [];

  (chapters || []).forEach((ch, idx) => {
    if (idx > 0) {
      textualChildren.push(new Paragraph({ pageBreakBefore: true }));
    }

    textualChildren.push(createHeading(`${ch.number} ${ch.title || ''}`));

    // Split paragraphs
    const paragraphs = (ch.content || '').split('\n\n').filter(Boolean);
    paragraphs.forEach((pText) => {
      textualChildren.push(createNormalParagraph(pText));
    });

    (ch.subsections || []).forEach((sub) => {
      textualChildren.push(createSubHeading(sub.number, sub.title || ''));
      const subParagraphs = (sub.content || '').split('\n\n').filter(Boolean);
      subParagraphs.forEach((spText) => {
        textualChildren.push(createNormalParagraph(spText));
      });
    });
  });

  // Section 3: REFERÊNCIAS
  textualChildren.push(new Paragraph({ pageBreakBefore: true }));
  textualChildren.push(createHeading('REFERÊNCIAS'));

  // Sort references alphabetically
  const sortedRefs = [...(references || [])].sort((a, b) => (a.autor || '').localeCompare(b.autor || ''));
  sortedRefs.forEach((ref) => {
    textualChildren.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 240, before: 120, after: 240 }, // single spacing, space between entries
        children: [new TextRun({ text: ref.formattedText || `${ref.autor}. ${ref.titulo}. ${ref.ano}`, font, size: 24 })],
      })
    );
  });

  // Build Word Document with 2 Sections
  // Section 1: Pre-Textual (No Page Header)
  // Section 2: Textual + References (With Page Header showing Page Numbers)
  const document = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: margins,
          },
        },
        children: preTextualChildren,
      },
      {
        properties: {
          page: {
            margin: margins,
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font,
                    size: 20, // 10pt
                  }),
                ],
              }),
            ],
          }),
        },
        children: textualChildren,
      },
    ],
  });

  return await Packer.toBlob(document);
}
