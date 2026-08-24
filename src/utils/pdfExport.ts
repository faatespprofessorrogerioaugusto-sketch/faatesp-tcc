import { jsPDF } from 'jspdf';
import { TccDocument } from '../types';
import { calculateDocumentPageMap, getFichaCatalograficaContent } from './abntFormatter';

/**
 * Direct PDF Download generator for ABNT TCC document
 * Uses native jsPDF vector rendering for instant, lightweight, 100% reliable generation.
 */
export async function downloadTccPdf(doc: TccDocument, authorFallback?: string): Promise<void> {
  const { preTextual, chapters, references, fontType } = doc;
  const pageMap = calculateDocumentPageMap(doc);
  const fichaData = getFichaCatalograficaContent(preTextual);

  // Initialize jsPDF A4 portrait in mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfFont = fontType === 'Times New Roman' ? 'times' : 'helvetica';
  const leftMargin = 30; // 3 cm
  const rightMargin = 20; // 2 cm
  const topMargin = 30; // 3 cm
  const bottomMargin = 20; // 2 cm
  const pageWidth = 210;
  const pageHeight = 297;
  const contentWidth = pageWidth - leftMargin - rightMargin; // 160 mm

  let isFirstPage = true;

  const addNewPage = () => {
    if (isFirstPage) {
      isFirstPage = false;
    } else {
      pdf.addPage('a4', 'portrait');
    }
  };

  // 1. CAPA (Pre-textual, no page number)
  addNewPage();
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(0, 0, 0);

  // Institution & Course
  let y = topMargin + 10;
  if (preTextual.instituicao) {
    const instLines = pdf.splitTextToSize(preTextual.instituicao.toUpperCase(), contentWidth);
    pdf.text(instLines, pageWidth / 2, y, { align: 'center' });
    y += instLines.length * 6;
  }
  if (preTextual.curso) {
    pdf.setFont(pdfFont, 'normal');
    pdf.setFontSize(11);
    const cursoLines = pdf.splitTextToSize(preTextual.curso.toUpperCase(), contentWidth);
    pdf.text(cursoLines, pageWidth / 2, y, { align: 'center' });
  }

  // Author (Centered)
  y = 100;
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(12);
  if (preTextual.autor) {
    pdf.text(preTextual.autor.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  }

  // Title & Subtitle (Centered)
  y = 145;
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(13);
  if (preTextual.titulo) {
    const titleLines = pdf.splitTextToSize(preTextual.titulo.toUpperCase(), contentWidth);
    pdf.text(titleLines, pageWidth / 2, y, { align: 'center' });
    y += titleLines.length * 6;
  }
  if (preTextual.subtitulo) {
    pdf.setFont(pdfFont, 'normal');
    pdf.setFontSize(11);
    const subLines = pdf.splitTextToSize(preTextual.subtitulo, contentWidth);
    pdf.text(subLines, pageWidth / 2, y, { align: 'center' });
  }

  // City & Year (Bottom)
  y = pageHeight - bottomMargin - 15;
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(11);
  if (preTextual.cidade) {
    pdf.text(preTextual.cidade.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  }
  if (preTextual.ano) {
    pdf.text(preTextual.ano, pageWidth / 2, y + 6, { align: 'center' });
  }

  // 2. FOLHA DE ROSTO
  addNewPage();
  y = topMargin + 10;
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(12);
  if (preTextual.autor) {
    pdf.text(preTextual.autor.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  }

  y = 85;
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(13);
  if (preTextual.titulo) {
    const titleLines = pdf.splitTextToSize(preTextual.titulo.toUpperCase(), contentWidth);
    pdf.text(titleLines, pageWidth / 2, y, { align: 'center' });
    y += titleLines.length * 6;
  }
  if (preTextual.subtitulo) {
    pdf.setFont(pdfFont, 'normal');
    pdf.setFontSize(11);
    const subLines = pdf.splitTextToSize(preTextual.subtitulo, contentWidth);
    pdf.text(subLines, pageWidth / 2, y, { align: 'center' });
  }

  // Natureza do trabalho (Recuo à direita, 50% largura)
  y = 135;
  const halfWidth = 80;
  const rightAlignX = leftMargin + 80;
  pdf.setFont(pdfFont, 'normal');
  pdf.setFontSize(10);
  const natText = preTextual.naturezaTrabalho || 'Trabalho de Conclusão de Curso apresentado ao corpo docente...';
  const natLines = pdf.splitTextToSize(natText, halfWidth);
  pdf.text(natLines, rightAlignX, y, { align: 'left', maxWidth: halfWidth });
  y += natLines.length * 5 + 6;

  if (preTextual.orientador) {
    pdf.setFont(pdfFont, 'bold');
    pdf.text(`Orientador: ${preTextual.orientador}`, rightAlignX, y);
    y += 5;
  }
  if (preTextual.coorientador) {
    pdf.setFont(pdfFont, 'normal');
    pdf.text(`Coorientador: ${preTextual.coorientador}`, rightAlignX, y);
  }

  // City & Year
  y = pageHeight - bottomMargin - 15;
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(11);
  if (preTextual.cidade) {
    pdf.text(preTextual.cidade.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  }
  if (preTextual.ano) {
    pdf.text(preTextual.ano, pageWidth / 2, y + 6, { align: 'center' });
  }

  // 2.5 FICHA CATALOGRÁFICA (Opcional)
  if (fichaData.incluirFicha) {
    addNewPage();
    // Ficha posicionada no terço inferior da página
    const fichaWidth = 140;
    const fichaX = (pageWidth - fichaWidth) / 2;
    const fichaY = pageHeight - bottomMargin - 105;

    pdf.rect(fichaX, fichaY, fichaWidth, 95);
    pdf.setFont(pdfFont, 'bold');
    pdf.setFontSize(9);
    pdf.text('Dados Internacionais de Catalogação na Publicação (CIP)', fichaX + fichaWidth / 2, fichaY + 7, { align: 'center' });

    pdf.setFont(pdfFont, 'normal');
    pdf.setFontSize(8.5);
    let fy = fichaY + 16;
    pdf.text(`${fichaData.autorCatalog}`, fichaX + 8, fy);
    fy += 5;
    const fTitleLines = pdf.splitTextToSize(fichaData.tituloCompleto, fichaWidth - 25);
    pdf.text(fTitleLines, fichaX + 20, fy);
    fy += fTitleLines.length * 4.5 + 2;

    pdf.text(fichaData.orientacao, fichaX + 20, fy);
    fy += 5;
    if (fichaData.coorientacao) {
      pdf.text(fichaData.coorientacao, fichaX + 20, fy);
      fy += 5;
    }
    pdf.text(fichaData.cidadeAno, fichaX + 20, fy);
    fy += 5;
    pdf.text(fichaData.numeroPaginas, fichaX + 20, fy);
    fy += 5;
    const fNatLines = pdf.splitTextToSize(fichaData.naturezaTrabalho, fichaWidth - 25);
    pdf.text(fNatLines, fichaX + 20, fy);
    fy += fNatLines.length * 4.5 + 2;

    const fKeywords = pdf.splitTextToSize(fichaData.palavrasChaveTexto, fichaWidth - 25);
    pdf.text(fKeywords, fichaX + 20, fy);
  }

  // 3. FOLHA DE APROVAÇÃO
  addNewPage();
  y = topMargin + 5;
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(12);
  if (preTextual.autor) {
    pdf.text(preTextual.autor.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  }

  y = 55;
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(13);
  if (preTextual.titulo) {
    const titleLines = pdf.splitTextToSize(preTextual.titulo.toUpperCase(), contentWidth);
    pdf.text(titleLines, pageWidth / 2, y, { align: 'center' });
    y += titleLines.length * 6;
  }
  if (preTextual.subtitulo) {
    pdf.setFont(pdfFont, 'normal');
    pdf.setFontSize(11);
    const subLines = pdf.splitTextToSize(preTextual.subtitulo, contentWidth);
    pdf.text(subLines, pageWidth / 2, y, { align: 'center' });
    y += subLines.length * 5;
  }

  y += 10;
  pdf.setFont(pdfFont, 'normal');
  pdf.setFontSize(10);
  const apprText = preTextual.naturezaTrabalho || 'Trabalho de Conclusão de Curso avaliado e aprovado pela banca examinadora...';
  const apprLines = pdf.splitTextToSize(apprText, contentWidth);
  pdf.text(apprLines, leftMargin, y);
  y += apprLines.length * 5 + 8;

  pdf.setFont(pdfFont, 'bold');
  pdf.text(`Aprovado em: ${preTextual.dataAprovacao || '____ / ____ / ________'}`, leftMargin, y);
  y += 16;

  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(11);
  pdf.text('BANCA EXAMINADORA', pageWidth / 2, y, { align: 'center' });
  y += 18;

  const members = preTextual.membrosBanca && preTextual.membrosBanca.length > 0
    ? preTextual.membrosBanca
    : [
        { id: '1', name: preTextual.orientador || 'Prof. Dr. Orientador', title: 'Orientador - Presidente', institution: preTextual.instituicao || '' },
        { id: '2', name: 'Prof. Dr. Segundo Examinador', title: 'Membro Avaliador Interno', institution: preTextual.instituicao || '' },
        { id: '3', name: 'Prof. Me. Terceiro Examinador', title: 'Membro Avaliador Externo', institution: 'Universidade Convidada' },
      ];

  members.forEach((m) => {
    pdf.line(pageWidth / 2 - 45, y, pageWidth / 2 + 45, y);
    y += 4.5;
    pdf.setFont(pdfFont, 'bold');
    pdf.setFontSize(10);
    pdf.text(m.name, pageWidth / 2, y, { align: 'center' });
    y += 4;
    pdf.setFont(pdfFont, 'normal');
    pdf.setFontSize(9);
    pdf.text(`${m.title} - ${m.institution}`, pageWidth / 2, y, { align: 'center' });
    y += 14;
  });

  // 4. RESUMO
  addNewPage();
  y = topMargin + 5;
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(12);
  pdf.text('RESUMO', pageWidth / 2, y, { align: 'center' });
  y += 12;

  pdf.setFont(pdfFont, 'normal');
  pdf.setFontSize(11);
  const resumoText = preTextual.resumo?.texto || '';
  if (resumoText) {
    const resumoLines = pdf.splitTextToSize(resumoText, contentWidth);
    pdf.text(resumoLines, leftMargin, y, { maxWidth: contentWidth, align: 'justify' });
    y += resumoLines.length * 6 + 10;
  } else {
    y += 20;
  }

  if (preTextual.resumo?.palavrasChave && preTextual.resumo.palavrasChave.length > 0) {
    pdf.setFont(pdfFont, 'bold');
    pdf.text('Palavras-chave: ', leftMargin, y);
    pdf.setFont(pdfFont, 'normal');
    pdf.text(preTextual.resumo.palavrasChave.join(' '), leftMargin + 28, y);
  }

  // 5. SUMÁRIO
  addNewPage();
  y = topMargin + 5;
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(12);
  pdf.text('SUMÁRIO', pageWidth / 2, y, { align: 'center' });
  y += 14;

  chapters.forEach((ch, idx) => {
    const chPageObj = pageMap.chapterPages.find((cp) => cp.chapterId === ch.id);
    const pageNum = chPageObj ? chPageObj.page : idx + 6;

    pdf.setFont(pdfFont, 'bold');
    pdf.setFontSize(11);
    pdf.text(`${ch.number}  ${ch.title.toUpperCase()}`, leftMargin, y);
    pdf.text(String(pageNum), pageWidth - rightMargin, y, { align: 'right' });
    y += 7;

    if (ch.subsections && ch.subsections.length > 0) {
      ch.subsections.forEach((sub, sIdx) => {
        const sNum = sub.number || `${ch.number}.${sIdx + 1}`;
        pdf.setFont(pdfFont, 'normal');
        pdf.setFontSize(10.5);
        pdf.text(`${sNum}  ${sub.title}`, leftMargin + 8, y);
        pdf.text(String(pageNum), pageWidth - rightMargin, y, { align: 'right' });
        y += 6;
      });
    }
  });

  // Referências no Sumário
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(11);
  pdf.text('REFERÊNCIAS', leftMargin, y);
  pdf.text(String(pageMap.referencesPage), pageWidth - rightMargin, y, { align: 'right' });

  // 6. CAPÍTULOS (Textual Elements with Page Number in Top Right)
  chapters.forEach((ch, idx) => {
    addNewPage();
    const chPageObj = pageMap.chapterPages.find((cp) => cp.chapterId === ch.id);
    const pageNum = chPageObj ? chPageObj.page : idx + 6;

    // Número da página no canto superior direito (2cm da borda superior e direita)
    pdf.setFont(pdfFont, 'normal');
    pdf.setFontSize(10);
    pdf.text(String(pageNum), pageWidth - rightMargin, 20, { align: 'right' });

    y = topMargin + 5;
    pdf.setFont(pdfFont, 'bold');
    pdf.setFontSize(12);
    pdf.text(`${ch.number}  ${ch.title.toUpperCase()}`, leftMargin, y);
    y += 12;

    pdf.setFont(pdfFont, 'normal');
    pdf.setFontSize(12);

    if (ch.content) {
      const paragraphs = ch.content.split('\n\n');
      paragraphs.forEach((p) => {
        if (!p.trim()) return;
        const pLines = pdf.splitTextToSize(p.trim(), contentWidth);
        if (y + pLines.length * 6 > pageHeight - bottomMargin) {
          addNewPage();
          pdf.setFont(pdfFont, 'normal');
          pdf.setFontSize(10);
          pdf.text(String(pageNum), pageWidth - rightMargin, 20, { align: 'right' });
          y = topMargin + 5;
          pdf.setFont(pdfFont, 'normal');
          pdf.setFontSize(12);
        }
        // First-line indent: 1.25 cm = 12.5 mm
        pdf.text(pLines, leftMargin + 12.5, y, { maxWidth: contentWidth - 12.5 });
        y += pLines.length * 6 + 4;
      });
    }

    if (ch.subsections && ch.subsections.length > 0) {
      ch.subsections.forEach((sub, sIdx) => {
        const sNum = sub.number || `${ch.number}.${sIdx + 1}`;
        y += 4;
        if (y > pageHeight - bottomMargin - 20) {
          addNewPage();
          pdf.setFont(pdfFont, 'normal');
          pdf.setFontSize(10);
          pdf.text(String(pageNum), pageWidth - rightMargin, 20, { align: 'right' });
          y = topMargin + 5;
        }
        pdf.setFont(pdfFont, 'bold');
        pdf.setFontSize(11.5);
        pdf.text(`${sNum}  ${sub.title}`, leftMargin, y);
        y += 8;

        if (sub.content) {
          pdf.setFont(pdfFont, 'normal');
          pdf.setFontSize(12);
          const subParagraphs = sub.content.split('\n\n');
          subParagraphs.forEach((p) => {
            if (!p.trim()) return;
            const spLines = pdf.splitTextToSize(p.trim(), contentWidth);
            if (y + spLines.length * 6 > pageHeight - bottomMargin) {
              addNewPage();
              pdf.setFont(pdfFont, 'normal');
              pdf.setFontSize(10);
              pdf.text(String(pageNum), pageWidth - rightMargin, 20, { align: 'right' });
              y = topMargin + 5;
              pdf.setFont(pdfFont, 'normal');
              pdf.setFontSize(12);
            }
            pdf.text(spLines, leftMargin + 12.5, y, { maxWidth: contentWidth - 12.5 });
            y += spLines.length * 6 + 4;
          });
        }
      });
    }
  });

  // 7. REFERÊNCIAS
  addNewPage();
  pdf.setFont(pdfFont, 'normal');
  pdf.setFontSize(10);
  pdf.text(String(pageMap.referencesPage), pageWidth - rightMargin, 20, { align: 'right' });

  y = topMargin + 5;
  pdf.setFont(pdfFont, 'bold');
  pdf.setFontSize(12);
  pdf.text('REFERÊNCIAS', pageWidth / 2, y, { align: 'center' });
  y += 14;

  const sortedRefs = [...references].sort((a, b) => (a.autor || '').localeCompare(b.autor || ''));
  pdf.setFont(pdfFont, 'normal');
  pdf.setFontSize(11);

  sortedRefs.forEach((ref) => {
    const refText = `${ref.autor ? ref.autor.trim() : ''}. ${ref.titulo}. ${ref.ano || ''}.`;
    const refLines = pdf.splitTextToSize(refText, contentWidth);
    if (y + refLines.length * 5.5 > pageHeight - bottomMargin) {
      addNewPage();
      pdf.setFont(pdfFont, 'normal');
      pdf.setFontSize(10);
      pdf.text(String(pageMap.referencesPage), pageWidth - rightMargin, 20, { align: 'right' });
      y = topMargin + 5;
      pdf.setFont(pdfFont, 'normal');
      pdf.setFontSize(11);
    }
    pdf.text(refLines, leftMargin, y);
    y += refLines.length * 5.5 + 4;
  });

  const studentName = (doc.preTextual.autor?.trim() || authorFallback?.trim() || 'Aluno')
    .replace(/[/\\?%*:|"<>]/g, '')
    .trim() || 'Aluno';

  pdf.save(`TCC FAATESP - ${studentName}.pdf`);
}
