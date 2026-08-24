import React, { useState, useEffect } from 'react';
import { FileCheck, X, Loader2, Check, ArrowRight, Lightbulb, Copy, BookOpen } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: string;
  chapterTitle: string;
  currentText: string;
  topic: string;
  onInsertText: (chapterId: string, textToAppend: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  chapterId,
  chapterTitle,
  currentText,
  topic,
  onInsertText,
}) => {
  const [guidelines, setGuidelines] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (!guidelines) {
        setGuidelines('Corrigir ortografia, pontuação, concordância e coesão gramatical do texto acadêmico.');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: chapterTitle,
          guidelines: guidelines || 'Corrigir ortografia e gramática',
          currentText,
          topic,
          workType: 'Trabalho de Conclusão de Curso (TCC / Monografia ABNT)',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao comunicar com o servidor da IA.');
      }

      setGeneratedDraft(data.draft || '');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Falha ao executar correção ortográfica e gramatical. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = () => {
    if (generatedDraft) {
      onInsertText(chapterId, generatedDraft);
      onClose();
    }
  };

  const samplePrompts = [
    'Corrigir erros de ortografia, acentuação e pontuação mantendo a estrutura do texto.',
    'Adequar a gramática para a norma culta e tom acadêmico impessoal em 3ª pessoa.',
    'Revisar a concordância verbal e nominal e aprimorar a coesão entre os parágrafos.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-600/30 rounded-xl border border-emerald-400/30 text-emerald-300">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Correção Ortográfica e Gramatical</h3>
              <p className="text-xs text-indigo-200 truncate max-w-[280px]">
                {chapterTitle || 'Seção Acadêmica'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Rules Banner */}
          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs text-blue-900 space-y-1">
            <p className="font-bold flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Garantia de Norma Culta e Padrão ABNT</span>
            </p>
            <p className="text-blue-800">
              A IA analisa e corrige automaticamente a ortografia, acentuação, gramática, concordância verbal e pontuação mantendo a linguagem formal acadêmica.
            </p>
          </div>

          {/* Current Text Context Info */}
          {currentText && (
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">Texto Atual a ser Corrigido ({currentText.length} caracteres):</span>
              <p className="text-slate-600 line-clamp-3 italic">"{currentText}"</p>
            </div>
          )}

          {/* Prompt Guidelines Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">
              Instruções para a Correção Ortográfica e Gramatical
            </label>
            <textarea
              rows={3}
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              placeholder="Ex: Corrigir erros ortográficos, revisar pontuação e ajustar a concordância verbal..."
              className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 leading-relaxed text-slate-700 font-normal"
            />
          </div>

          {/* Sample Guidelines Chips */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-slate-500 flex items-center space-x-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Sugestões de ajustes:</span>
            </p>
            <div className="space-y-1.5">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setGuidelines(p)}
                  className="w-full text-left text-[11px] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900 p-2 rounded-lg border border-slate-200 transition-all text-slate-700"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all disabled:opacity-50 text-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Analisando e Corrigindo Texto...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4 text-emerald-300" />
                <span>Executar Correção Ortográfica e Gramatical</span>
              </>
            )}
          </button>

          {/* Generated Text Preview Output */}
          {generatedDraft && (
            <div className="space-y-2 pt-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Texto Corrigido e Aprimorado</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedDraft);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-slate-500 hover:text-indigo-600 flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 font-sans text-xs text-slate-800 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap shadow-inner indent-[1.25cm]">
                {generatedDraft}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
          >
            Cancelar
          </button>

          <button
            onClick={handleInsert}
            disabled={!generatedDraft}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center space-x-2 shadow transition-all disabled:opacity-40"
          >
            <span>Aplicar Texto Corrigido no Capítulo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
