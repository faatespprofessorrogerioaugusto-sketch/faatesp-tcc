import React, { useState } from 'react';
import { TccDocument } from '../types';
import { exportTccToDocx } from '../utils/docxExport';
import { Download, FileText, Printer, CheckCircle, FileCheck, X, Sparkles, Loader2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: TccDocument;
  onPrintPdf: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  doc,
  onPrintPdf,
}) => {
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  if (!isOpen) return null;

  const handleDownloadWord = async () => {
    setIsExportingDocx(true);
    try {
      const blob = await exportTccToDocx(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.preTextual.titulo || 'TCC'}_ABNT.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao exportar Word:', err);
      alert('Erro ao gerar arquivo Word (.docx). Tente novamente.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-6 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
            <Download className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Tela de Exportação Avançada</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Gere e compila todos os elementos do seu TCC (Capa, Folha de Rosto, Sumário atualizado e Capítulos) no padrão ABNT NBR 14724.
          </p>
        </div>

        {/* Document Specs Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span>Título:</span>
            <span className="text-blue-700 truncate max-w-[200px]">{doc.preTextual.titulo || 'Monografia'}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Fonte ABNT selecionada:</span>
            <span className="font-semibold text-slate-900">{doc.fontType} (12pt / 1.5 spacing)</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Margens Normativas:</span>
            <span className="font-semibold text-slate-900">3cm Sup./Esq. • 2cm Inf./Dir.</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Capítulos Compilados:</span>
            <span className="font-semibold text-slate-900">{doc.chapters.length} Capítulos</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Referências NBR 6023:</span>
            <span className="font-semibold text-slate-900">{doc.references.length} fontes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDownloadWord}
            disabled={isExportingDocx}
            className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
          >
            {isExportingDocx ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Compilando arquivo .docx...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Baixar em Word (.docx)</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onClose();
              onPrintPdf();
            }}
            className="w-full flex items-center justify-center space-x-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm"
          >
            <Printer className="w-5 h-5" />
            <span>Baixar em PDF / Imprimir</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-400">
          * Ambos os formatos respeitam estritamente a Regra de Ouro de paginação (número visível apenas a partir da Introdução).
        </p>
      </div>
    </div>
  );
};
