import React, { useState } from 'react';
import { Chapter, SubSection } from '../types';
import {
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  AlertCircle,
  MoveUp,
  MoveDown,
  ChevronRight,
  FileText,
  Check,
  CheckCircle2,
  GripVertical,
} from 'lucide-react';

interface ChapterManagerProps {
  chapters: Chapter[];
  onChange: (chapters: Chapter[]) => void;
  onOpenAiAssistant: (chapterId: string, chapterTitle: string, currentText: string) => void;
}

export const ChapterManager: React.FC<ChapterManagerProps> = ({
  chapters,
  onChange,
  onOpenAiAssistant,
}) => {
  const [activeChapterId, setActiveChapterId] = useState<string>(chapters[0]?.id || '');
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const activeChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  // Re-index chapters sequentially (1, 2, 3...)
  const reindexChapters = (chapList: Chapter[]): Chapter[] => {
    return chapList.map((c, index) => {
      const newNum = index + 1;
      return {
        ...c,
        number: newNum,
        subsections: c.subsections.map((sub, subIdx) => ({
          ...sub,
          number: `${newNum}.${subIdx + 1}`,
        })),
      };
    });
  };

  // Add new chapter with validation rule
  const handleAddChapter = () => {
    // Check if last chapter has empty title
    if (chapters.length > 0) {
      const lastChap = chapters[chapters.length - 1];
      if (!lastChap.title || lastChap.title.trim() === '') {
        setValidationWarning(
          `Por favor, preencha o título do "Capítulo ${lastChap.number}" antes de adicionar um novo capítulo.`
        );
        setTimeout(() => setValidationWarning(null), 5000);
        return;
      }
    }

    setValidationWarning(null);
    const newNumber = chapters.length + 1;
    const newChapter: Chapter = {
      id: `cap-${Date.now()}`,
      number: newNumber,
      title: '', // User will type
      content: '',
      subsections: [
        {
          id: `sub-${Date.now()}-1`,
          number: `${newNumber}.1`,
          title: 'Subseção 1',
          content: '',
        },
      ],
    };

    const updated = reindexChapters([...chapters, newChapter]);
    onChange(updated);
    setActiveChapterId(newChapter.id);
  };

  // Remove chapter and automatically reindex
  const handleRemoveChapter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (chapters.length <= 1) {
      alert('O documento precisa ter pelo menos 1 capítulo.');
      return;
    }

    if (confirm('Tem certeza que deseja remover este capítulo? Os capítulos seguintes serão renumerados automaticamente.')) {
      const filtered = chapters.filter((c) => c.id !== id);
      const reindexed = reindexChapters(filtered);
      onChange(reindexed);
      if (activeChapterId === id) {
        setActiveChapterId(reindexed[0]?.id || '');
      }
    }
  };

  // Move chapter up or down manually
  const handleMoveChapter = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= chapters.length) return;
    const updated = [...chapters];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    const reindexed = reindexChapters(updated);
    onChange(reindexed);
  };

  // Drag and Drop handlers
  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const updated = [...chapters];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, moved);
      const reindexed = reindexChapters(updated);
      onChange(reindexed);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Update chapter details
  const handleUpdateChapter = (field: keyof Chapter, value: any) => {
    const updated = chapters.map((c) =>
      c.id === activeChapter.id ? { ...c, [field]: value } : c
    );
    onChange(updated);
  };

  // Add subsection
  const handleAddSubsection = () => {
    const nextSubNum = `${activeChapter.number}.${activeChapter.subsections.length + 1}`;
    const newSub: SubSection = {
      id: `sub-${Date.now()}`,
      number: nextSubNum,
      title: 'Nova Subseção',
      content: '',
    };
    const updatedSubsections = [...activeChapter.subsections, newSub];
    handleUpdateChapter('subsections', updatedSubsections);
  };

  // Remove subsection
  const handleRemoveSubsection = (subId: string) => {
    const filtered = activeChapter.subsections.filter((s) => s.id !== subId);
    const reindexedSubs = filtered.map((s, idx) => ({
      ...s,
      number: `${activeChapter.number}.${idx + 1}`,
    }));
    handleUpdateChapter('subsections', reindexedSubs);
  };

  // Update subsection
  const handleUpdateSubsection = (subId: string, field: keyof SubSection, value: string) => {
    const updatedSubs = activeChapter.subsections.map((s) =>
      s.id === subId ? { ...s, [field]: value } : s
    );
    handleUpdateChapter('subsections', updatedSubs);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 animate-fadeIn transition-colors duration-200">
      {/* Chapter Sidebar / Sumário List */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-4 h-fit">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Estrutura de Capítulos</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Sincronizado com o Sumário ABNT</p>
          </div>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
            {chapters.length}
          </span>
        </div>

        {/* Validation Warning Alert */}
        {validationWarning && (
          <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 p-3 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>{validationWarning}</span>
          </div>
        )}

        {/* Chapter Items List */}
        <div className="space-y-2">
          {chapters.map((ch, index) => {
            const isActive = ch.id === activeChapterId;
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div
                key={ch.id}
                draggable
                onDragStart={(e) => handleDragStart(index, e)}
                onDragOver={(e) => handleDragOver(index, e)}
                onDrop={(e) => handleDrop(index, e)}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                onClick={() => setActiveChapterId(ch.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group select-none ${
                  isDragging ? 'opacity-40 border-dashed border-blue-400 bg-blue-50 dark:bg-blue-950/40' : ''
                } ${
                  isDragOver ? 'border-2 border-blue-500 bg-blue-100/80 dark:bg-blue-900/50 scale-[1.02]' : ''
                } ${
                  !isDragging && !isDragOver
                    ? isActive
                      ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-400 dark:border-blue-700 text-blue-950 dark:text-blue-200 shadow-sm font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : ''
                }`}
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  <span
                    className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
                    title="Clique e arraste para reordenar"
                  >
                    <GripVertical className="w-4 h-4" />
                  </span>
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {ch.number}
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">
                      {ch.title ? ch.title.toUpperCase() : `CAPÍTULO ${ch.number}`}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {ch.subsections.length} subseções
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-0.5 shrink-0">
                  <div className="hidden group-hover:flex items-center space-x-0.5">
                    {index > 0 && (
                      <button
                        onClick={(e) => handleMoveChapter(index, 'up', e)}
                        className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all cursor-pointer"
                        title="Mover para cima"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {index < chapters.length - 1 && (
                      <button
                        onClick={(e) => handleMoveChapter(index, 'down', e)}
                        className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all cursor-pointer"
                        title="Mover para baixo"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleRemoveChapter(ch.id, e)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all cursor-pointer"
                      title="Remover Capítulo (Reindexação Automática)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ml-1 ${
                      isActive ? 'text-blue-600 dark:text-blue-400 translate-x-0.5' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Add Chapter Button */}
        <button
          onClick={handleAddChapter}
          className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all border border-slate-700 dark:border-blue-500 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-blue-400 dark:text-white" />
          <span>+ Adicionar Capítulo</span>
        </button>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/70 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-300">Arrastar & Soltar / Reindexação:</p>
          <p>
            Clique e arraste o ícone de garras ou a caixa para trocar a posição dos capítulos. A numeração e o Sumário ABNT são atualizados em tempo real.
          </p>
        </div>
      </div>

      {/* Chapter Main Active Editor */}
      {activeChapter && (
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
            <div className="space-y-1">
              <span className="text-xs bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-mono font-bold px-2.5 py-0.5 rounded-md">
                Capítulo {activeChapter.number} (ABNT 12pt Negrito)
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {activeChapter.title ? activeChapter.title.toUpperCase() : 'Título do Capítulo'}
              </h2>
            </div>

            {/* AI Assistant Call Button */}
            <button
              onClick={() =>
                onOpenAiAssistant(
                  activeChapter.id,
                  `Capítulo ${activeChapter.number}: ${activeChapter.title}`,
                  activeChapter.content
                )
              }
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-2 shadow-md transition-all border border-indigo-400/30 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Correção Ortográfica e Gramatical</span>
            </button>
          </div>

          {/* Title Edit Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Título do Capítulo {activeChapter.number} (Salvo em CAIXA ALTA)
            </label>
            <input
              type="text"
              value={activeChapter.title}
              onChange={(e) => handleUpdateChapter('title', e.target.value.toUpperCase())}
              placeholder="EX: INTRODUÇÃO / REVISÃO DA LITERATURA / METODOLOGIA"
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 font-normal uppercase"
            />
          </div>

          {/* Chapter Main Content Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Texto Principal do Capítulo (Recuo 1,25 cm, Espaçamento 1,5, Justificado)
              </label>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {activeChapter.content.split(/\s+/).filter(Boolean).length} palavras
              </span>
            </div>
            <textarea
              rows={10}
              value={activeChapter.content}
              onChange={(e) => handleUpdateChapter('content', e.target.value)}
              placeholder="Digite ou cole o texto do capítulo aqui..."
              className="w-full text-xs p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed font-normal"
            />
          </div>

          {/* Subsections Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Subseções do Capítulo {activeChapter.number} (Ex: {activeChapter.number}.1, {activeChapter.number}.2)
              </h4>
              <button
                onClick={handleAddSubsection}
                className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Subseção</span>
              </button>
            </div>

            <div className="space-y-4">
              {activeChapter.subsections.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/70 space-y-3 relative"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-2 py-1 rounded">
                        {sub.number}
                      </span>
                      <input
                        type="text"
                        value={sub.title}
                        onChange={(e) => handleUpdateSubsection(sub.id, 'title', e.target.value)}
                        placeholder="Título da Subseção"
                        className="flex-1 text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-normal"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveSubsection(sub.id)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-lg cursor-pointer"
                      title="Excluir subseção"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={sub.content}
                    onChange={(e) => handleUpdateSubsection(sub.id, 'content', e.target.value)}
                    placeholder="Conteúdo da subseção..."
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500 leading-relaxed font-normal"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
