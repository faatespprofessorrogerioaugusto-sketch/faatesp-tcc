import React from 'react';
import { TccDocument } from '../types';
import { calculateProgress } from '../utils/abntFormatter';
import {
  CheckCircle2,
  CircleAlert,
  Sparkles,
  BookOpen,
  FileText,
  Quote,
  Layout,
  ArrowRight,
  TrendingUp,
  Download,
  Check,
} from 'lucide-react';

interface DashboardProps {
  doc: TccDocument;
  onNavigateTab: (tab: string) => void;
  onOpenAiAssistant: (chapterId?: string) => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  doc,
  onNavigateTab,
  onOpenAiAssistant,
  onExportDocx,
  onExportPdf,
}) => {
  const { percentage, breakdown } = calculateProgress(doc);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Painel de Desenvolvimento ABNT NBR 14724</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {doc.preTextual.titulo || 'Seu Trabalho de Conclusão de Curso'}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Acompanhe o progresso do seu TCC em tempo real. Cada seção preenchida atualiza automaticamente o sumário, a paginação ABNT e a prontidão de exportação.
            </p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold text-white">Progresso Geral do TCC</span>
            </div>
            <span className="text-2xl font-black text-blue-400 font-mono">{percentage}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-4 p-0.5 border border-slate-700 relative overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>Inicio do Projeto</span>
            <span>{percentage === 100 ? 'Pronto para Defesa!' : `${100 - percentage}% restante`}</span>
            <span>Conclusão (100%)</span>
          </div>
        </div>
      </div>

      {/* Progress Calculation Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          <span>Regra de Cálculo Automático de Porcentagem</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                item.completed
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  item.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {item.completed ? <Check className="w-4 h-4" /> : <CircleAlert className="w-4 h-4" />}
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span>{item.name}</span>
                  <span className="font-mono text-blue-700">+{item.score}%</span>
                </div>
                <p className="text-slate-500">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Cards per Document Module */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Capa & Folha de Rosto */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 text-blue-800 p-2.5 rounded-xl">
                <Layout className="w-5 h-5" />
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  doc.preTextual.titulo
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {doc.preTextual.titulo ? 'Preenchida' : 'Pendente'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Capa e Folha de Rosto</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {doc.preTextual.instituicao} • {doc.preTextual.autor}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('pre-textual')}
            className="w-full text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-between"
          >
            <span>Editar Capa & Folha de Rosto</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Card 2: Capítulos e Estrutura */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-indigo-100 text-indigo-800 p-2.5 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-1 rounded-full">
                {doc.chapters.length} Capítulos
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Assistente de Sumário</h4>
              <p className="text-xs text-slate-500 mt-1">
                Adicione capítulos com reindexação automática e formatação em Caixa Alta e Negrito.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('chapters')}
            className="w-full text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-between"
          >
            <span>Gerenciar Capítulos</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Card 3: Resumo e Abstract */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-purple-100 text-purple-800 p-2.5 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  doc.preTextual.resumo.texto
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {doc.preTextual.resumo.texto ? 'Resumos Prontos' : 'Incompleto'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Resumo & Abstract</h4>
              <p className="text-xs text-slate-500 mt-1">
                Parágrafo único (150-500 palavras), espaçamento simples e palavras-chave.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('pre-textual')}
            className="w-full text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-between"
          >
            <span>Editar Resumos</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Card 4: Banco de Citações NBR 6023 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl">
                <Quote className="w-5 h-5" />
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
                {doc.references.length} Referências
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Banco de Citações NBR 6023</h4>
              <p className="text-xs text-slate-500 mt-1">
                Livros, artigos acadêmicos e sites organizados em ordem alfabética de autor.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('references')}
            className="w-full text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-between"
          >
            <span>Gerenciar Referências</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Card 5: Visualização e Paginação ABNT */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-amber-100 text-amber-800 p-2.5 rounded-xl">
                <Layout className="w-5 h-5" />
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-full">
                Regra de Ouro ABNT
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Visualização A4 & Paginação</h4>
              <p className="text-xs text-slate-500 mt-1">
                Número de página oculto nos pré-textuais e visível no canto superior direito a partir da Introdução.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('preview')}
            className="w-full text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-between"
          >
            <span>Ver Folhas A4</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Card 6: Exportação Avançada */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-blue-600 text-white p-2.5 rounded-xl">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-xs bg-blue-600 text-white font-semibold px-2.5 py-1 rounded-full">
                Pronto para Envio
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Exportação Word e PDF</h4>
              <p className="text-xs text-slate-600 mt-1">
                Baixe seu trabalho compilado em .docx ou PDF mantendo todas as margens ABNT (3cm superior/esquerda, 2cm inferior/direita).
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onExportDocx}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-2 rounded-lg transition-all text-center"
            >
              Baixar Word
            </button>
            <button
              onClick={onExportPdf}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-2 rounded-lg transition-all text-center"
            >
              Baixar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
