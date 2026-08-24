import React, { useState } from 'react';
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
  Printer,
  Loader2,
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
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Regra de Cálculo Automático de Porcentagem</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                item.completed
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  item.completed ? 'bg-emerald-600 dark:bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.completed ? <Check className="w-4 h-4" /> : <CircleAlert className="w-4 h-4" />}
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-slate-100">{item.name}</span>
                  <span className="font-mono text-blue-700 dark:text-blue-400">+{item.score}%</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Cards per Document Module */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Capa & Folha de Rosto */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 p-2.5 rounded-xl">
                <Layout className="w-5 h-5" />
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  doc.preTextual.titulo
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                }`}
              >
                {doc.preTextual.titulo ? 'Preenchida' : 'Pendente'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Capa e Folha de Rosto</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {doc.preTextual.instituicao} • {doc.preTextual.autor}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('pre-textual')}
            className="w-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Editar Capa & Folha de Rosto</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Card 2: Capítulos e Estrutura */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 p-2.5 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-semibold px-2.5 py-1 rounded-full">
                {doc.chapters.length} Capítulos
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Assistente de Sumário</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Adicione capítulos com reindexação automática e formatação em Caixa Alta e Negrito.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('chapters')}
            className="w-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Gerenciar Capítulos</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Card 3: Resumo e Abstract */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 p-2.5 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  doc.preTextual.resumo.texto
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                }`}
              >
                {doc.preTextual.resumo.texto ? 'Resumos Prontos' : 'Incompleto'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Resumo & Abstract</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Parágrafo único (150-500 palavras), espaçamento simples e palavras-chave.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('pre-textual')}
            className="w-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Editar Resumos</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Card 4: Banco de Citações NBR 6023 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 p-2.5 rounded-xl">
                <Quote className="w-5 h-5" />
              </div>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold px-2.5 py-1 rounded-full">
                {doc.references.length} Referências
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Banco de Citações NBR 6023</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Livros, artigos acadêmicos e sites organizados em ordem alfabética de autor.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('references')}
            className="w-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Gerenciar Referências</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Card 5: Visualização e Paginação ABNT */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 p-2.5 rounded-xl">
                <Layout className="w-5 h-5" />
              </div>
              <span className="text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold px-2.5 py-1 rounded-full">
                Regra de Ouro ABNT
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Visualização A4 & Paginação</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Número de página oculto nos pré-textuais e visível no canto superior direito a partir da Introdução.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('preview')}
            className="w-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Ver Folhas A4</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Card 6: Exportação Direta */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/60 rounded-xl p-5 border border-blue-200 dark:border-blue-900/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-sm">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-xs bg-blue-600 text-white font-semibold px-2.5 py-1 rounded-full shadow-xs">
                Exportação Direta
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Baixar DOCX & PDF</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Gere e baixe seu trabalho compilado diretamente mantendo todas as normas e margens ABNT NBR 14724.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onExportDocx}
              className="text-xs bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              title="Baixar arquivo DOCX formatado em ABNT"
            >
              <FileText className="w-4 h-4" />
              <span>Baixar DOCX</span>
            </button>
            <button
              type="button"
              onClick={onExportPdf}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              title="Baixar arquivo PDF formatado em ABNT"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
