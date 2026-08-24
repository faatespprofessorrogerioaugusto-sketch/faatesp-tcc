import React from 'react';
import { TccDocument } from '../types';
import { calculateDocumentPageMap, getFichaCatalograficaContent } from '../utils/abntFormatter';
import { Printer, Eye, Info, CheckCircle2 } from 'lucide-react';

interface AbntPreviewProps {
  doc: TccDocument;
  onPrintPdf: () => void;
}

export const AbntPreview: React.FC<AbntPreviewProps> = ({ doc, onPrintPdf }) => {
  const { fontType, preTextual, chapters, references } = doc;
  const pageMap = calculateDocumentPageMap(doc);
  const fichaData = getFichaCatalograficaContent(preTextual);

  const fontClass = fontType === 'Arial' ? 'font-sans' : 'font-serif';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Visualização A4 com Regra de Ouro ABNT NBR 14724
            </h3>
            <p className="text-xs text-slate-500">
              Margens: Sup. 3cm / Esq. 3cm / Inf. 2cm / Dir. 2cm • Fonte: {fontType} 12pt
            </p>
          </div>
        </div>

        <button
          onClick={onPrintPdf}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center space-x-2 transition-all shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Gerar PDF ABNT</span>
        </button>
      </div>

      {/* Regra de Ouro Explanation Box */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-4 rounded-2xl shadow-md border border-blue-800 flex items-start space-x-3 text-xs">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-blue-200">Entenda a Regra de Ouro da Numeração ABNT:</p>
          <p className="text-slate-300 leading-relaxed">
            A contagem das páginas inicia-se a partir da Folha de Rosto (Página 1). Contudo, o número impresso (algarismos arábicos no canto superior direito) <strong className="text-white underline">SÓ APARECE VISIVELMENTE</strong> a partir da primeira folha da Introdução. Todos os elementos pré-textuais anteriores contam a paginação, porém com os números ocultos.
          </p>
        </div>
      </div>

      {/* Printable / Visual A4 Document Sheets Container */}
      <div className="flex flex-col items-center space-y-8 py-4 bg-slate-200/70 p-4 sm:p-8 rounded-3xl overflow-x-auto print:bg-white print:p-0">
        
        {/* SHEET 1: CAPA */}
        <div
          className={`bg-white shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-[30mm_20mm_20mm_30mm] text-slate-900 relative flex flex-col justify-between border border-slate-300 ${fontClass} print:shadow-none print:w-full print:p-0`}
        >
          {/* No Page Number on Capa */}

          {/* Header Institution */}
          <div className="text-center space-y-1 font-bold text-sm uppercase tracking-wide">
            <p>{preTextual.instituicao}</p>
            <p className="font-normal text-xs">{preTextual.curso}</p>
          </div>

          {/* Author */}
          <div className="text-center font-bold text-sm uppercase my-auto py-12">
            {preTextual.autor}
          </div>

          {/* Title */}
          <div className="text-center space-y-2 my-auto">
            <h1 className="font-extrabold text-base uppercase leading-snug tracking-tight">
              {preTextual.titulo}
            </h1>
            {preTextual.subtitulo && (
              <p className="font-serif italic text-xs text-slate-700">{preTextual.subtitulo}</p>
            )}
          </div>

          {/* City & Year */}
          <div className="text-center font-bold text-xs uppercase mt-auto pt-16">
            <p>{preTextual.cidade}</p>
            <p>{preTextual.ano}</p>
          </div>
        </div>

        {/* SHEET 2: FOLHA DE ROSTO (PÁGINA 1 CONTADA - NÚMERO OCULTO) */}
        <div
          className={`bg-white shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-[30mm_20mm_20mm_30mm] text-slate-900 relative flex flex-col justify-between border border-slate-300 ${fontClass} print:shadow-none print:w-full`}
        >
          {/* Page Number Label (Invisible in Print, Indicator in Preview) */}
          <div className="absolute top-4 right-6 text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 print:hidden">
            Pag. 1 (Oculta por regra ABNT)
          </div>

          <div className="text-center font-bold text-sm uppercase">
            {preTextual.autor}
          </div>

          <div className="text-center space-y-2 my-auto">
            <h2 className="font-extrabold text-base uppercase leading-snug">
              {preTextual.titulo}
            </h2>
          </div>

          {/* Nature of Work Text (Indent ~8cm to right, size 10pt, single line spacing) */}
          <div className="ml-[80mm] space-y-3 text-[10pt] leading-tight text-justify my-8">
            <p>{preTextual.naturezaTrabalho}</p>
            <p className="font-bold">Orientador: {preTextual.orientador}</p>
            {preTextual.coorientador && <p>Coorientador: {preTextual.coorientador}</p>}
          </div>

          <div className="text-center font-bold text-xs uppercase mt-auto">
            <p>{preTextual.cidade}</p>
            <p>{preTextual.ano}</p>
          </div>
        </div>

        {/* SHEET 2.5: FICHA CATALOGRÁFICA (VERSO DA FOLHA DE ROSTO - ABNT NBR 14724) */}
        {fichaData.incluirFicha && (
          <div
            className={`bg-white shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-[30mm_20mm_20mm_30mm] text-slate-900 relative flex flex-col justify-end pb-16 border border-slate-300 ${fontClass} print:shadow-none print:w-full`}
          >
            <div className="absolute top-4 right-6 text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 print:hidden">
              Verso da Folha de Rosto (Oculta por regra ABNT)
            </div>

            <div className="w-[145mm] mx-auto bg-white text-[10pt] leading-snug">
              {/* Header Box */}
              <div className="border border-slate-900 p-2 text-center font-bold text-slate-900 text-[11pt] tracking-wider uppercase">
                FICHA CATALOGRÁFICA
              </div>

              {/* Main Box attached directly below */}
              <div className="border border-slate-900 border-t-0 p-6 space-y-4 text-slate-900">
                <p>{fichaData.autorCatalog}</p>
                <p>{fichaData.tituloCompleto}</p>
                <p>{fichaData.orientacao}</p>
                {fichaData.coorientacao && <p>{fichaData.coorientacao}</p>}
                <p>{fichaData.cidadeAno}</p>
                <p>{fichaData.numeroPaginas}</p>
                <p>{fichaData.naturezaTrabalho}</p>
                <p>{fichaData.palavrasChaveTexto}</p>
              </div>
            </div>
          </div>
        )}

        {/* SHEET 3: FOLHA DE APROVAÇÃO (PÁGINA CONTADA - NÚMERO OCULTO) */}
        <div
          className={`bg-white shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-[30mm_20mm_20mm_30mm] text-slate-900 relative flex flex-col justify-between border border-slate-300 ${fontClass} print:shadow-none print:w-full`}
        >
          <div className="absolute top-4 right-6 text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 print:hidden">
            Pag. 2 (Oculta por regra ABNT)
          </div>

          <div className="text-center font-bold text-sm uppercase">
            {preTextual.autor}
          </div>

          <div className="text-center space-y-2 my-auto">
            <h2 className="font-extrabold text-base uppercase">
              {preTextual.titulo}
            </h2>
          </div>

          <div className="space-y-8 my-auto text-center">
            <p className="font-bold text-xs uppercase">BANCA EXAMINADORA</p>
            {preTextual.membrosBanca.map((m) => (
              <div key={m.id} className="space-y-0.5 text-xs">
                <div className="w-64 border-t border-slate-800 mx-auto pt-1" />
                <p className="font-bold">{m.name}</p>
                <p className="text-[10pt] text-slate-600">{m.title} - {m.institution}</p>
              </div>
            ))}
          </div>

          <div className="text-center font-bold text-xs uppercase mt-auto">
            <p>{preTextual.cidade}</p>
          </div>
        </div>

        {/* SHEET 4: RESUMO EM PORTUGUÊS (NÚMERO OCULTO) */}
        <div
          className={`bg-white shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-[30mm_20mm_20mm_30mm] text-slate-900 relative space-y-6 border border-slate-300 ${fontClass} print:shadow-none print:w-full`}
        >
          <div className="absolute top-4 right-6 text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 print:hidden">
            Pag. Pré-Textual (Oculta)
          </div>

          <h2 className="text-center font-bold text-sm uppercase tracking-wider">RESUMO</h2>

          <p className="text-[12pt] leading-normal text-justify">
            {preTextual.resumo.texto}
          </p>

          <p className="text-[12pt] font-normal text-justify">
            <strong className="font-bold">Palavras-chave:</strong> {preTextual.resumo.palavrasChave.join(' ')}
          </p>
        </div>

        {/* SHEET 5: SUMÁRIO DINÂMICO (COM PONTOS DE PREENCHIMENTO E PÁGINAS CORRESPONDENTES) */}
        <div
          className={`bg-white shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-[30mm_20mm_20mm_30mm] text-slate-900 relative space-y-6 border border-slate-300 ${fontClass} print:shadow-none print:w-full`}
        >
          <div className="absolute top-4 right-6 text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 print:hidden">
            Pag. Pré-Textual (Oculta)
          </div>

          <h2 className="text-center font-bold text-sm uppercase tracking-wider">SUMÁRIO</h2>

          <div className="space-y-3 text-[12pt]">
            {pageMap.chapterPages.map((cp) => (
              <div key={cp.chapterId} className="space-y-1">
                {/* Main Chapter Title with Dot Leader */}
                <div className="flex items-end justify-between font-bold uppercase">
                  <span>{cp.title}</span>
                  <div className="flex-1 mx-2 border-b-2 border-dotted border-slate-400 h-1 mb-1" />
                  <span className="font-mono">{cp.page}</span>
                </div>

                {/* Subsections list */}
                {chapters.find(c => c.id === cp.chapterId)?.subsections.map((sub) => (
                  <div key={sub.id} className="flex items-end justify-between text-[11pt] font-normal pl-4">
                    <span>{sub.number} {sub.title}</span>
                    <div className="flex-1 mx-2 border-b border-dotted border-slate-300 h-1 mb-1" />
                    <span className="font-mono">{cp.page}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* References item in TOC */}
            <div className="flex items-end justify-between font-bold uppercase pt-2">
              <span>REFERÊNCIAS</span>
              <div className="flex-1 mx-2 border-b-2 border-dotted border-slate-400 h-1 mb-1" />
              <span className="font-mono">{pageMap.referencesPage}</span>
            </div>
          </div>
        </div>

        {/* CHAPTER SHEETS (FIRST TEXTUAL ELEMENT - PAGE NUMBERS VISIBLE ON TOP RIGHT) */}
        {chapters.map((ch, idx) => {
          const chPageInfo = pageMap.chapterPages.find((cp) => cp.chapterId === ch.id);
          const pageNum = chPageInfo?.page || (idx + 6);

          return (
            <div
              key={ch.id}
              className={`bg-white shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-[30mm_20mm_20mm_30mm] text-slate-900 relative space-y-6 border border-slate-300 ${fontClass} print:shadow-none print:w-full`}
            >
              {/* PAGE NUMBER VISIBLE IN ARABIC NUMERALS SIZE 10 AT TOP RIGHT CORNER! */}
              <div className="absolute top-[15mm] right-[20mm] font-mono text-[10pt] font-bold text-slate-900">
                {pageNum}
              </div>

              {/* Chapter Title */}
              <h2 className="font-extrabold text-[12pt] uppercase leading-tight tracking-wide text-left pt-2">
                {ch.number} {ch.title}
              </h2>

              {/* Main Text Content (Indent 1.25 cm, 1.5 spacing, justified) */}
              <div className="text-[12pt] leading-[1.5] text-justify space-y-4 indent-[1.25cm]">
                {ch.content.split('\n\n').map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>

              {/* Subsections */}
              {ch.subsections.map((sub) => (
                <div key={sub.id} className="space-y-3 pt-3">
                  <h3 className="font-bold text-[12pt] text-left">
                    {sub.number} {sub.title}
                  </h3>
                  <div className="text-[12pt] leading-[1.5] text-justify space-y-4 indent-[1.25cm]">
                    {sub.content.split('\n\n').map((sp, spIdx) => (
                      <p key={spIdx}>{sp}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {/* SHEET LAST: REFERÊNCIAS BIBLIOGRÁFICAS (PAGE NUMBER VISIBLE) */}
        <div
          className={`bg-white shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-[30mm_20mm_20mm_30mm] text-slate-900 relative space-y-6 border border-slate-300 ${fontClass} print:shadow-none print:w-full`}
        >
          <div className="absolute top-[15mm] right-[20mm] font-mono text-[10pt] font-bold text-slate-900">
            {pageMap.referencesPage}
          </div>

          <h2 className="font-extrabold text-[12pt] uppercase leading-tight tracking-wide text-left pt-2">
            REFERÊNCIAS
          </h2>

          <div className="space-y-4 text-[12pt] leading-tight text-justify">
            {[...references].sort((a, b) => a.autor.localeCompare(b.autor)).map((ref) => (
              <p key={ref.id} className="pb-2 border-b border-slate-100 last:border-none">
                {ref.formattedText}
              </p>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
