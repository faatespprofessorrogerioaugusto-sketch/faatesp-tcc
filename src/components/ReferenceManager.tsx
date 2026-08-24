import React, { useState } from 'react';
import { ReferenceItem, ReferenceType, Chapter } from '../types';
import { formatReference } from '../utils/abntFormatter';
import { Plus, Trash2, Quote, BookOpen, FileText, Globe, Check, Edit2, Sparkles, ExternalLink } from 'lucide-react';

interface ReferenceManagerProps {
  references: ReferenceItem[];
  chapters: Chapter[];
  onChange: (references: ReferenceItem[]) => void;
}

export const ReferenceManager: React.FC<ReferenceManagerProps> = ({
  references,
  chapters,
  onChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [type, setType] = useState<ReferenceType>('livro');
  const [autor, setAutor] = useState('');
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [edicao, setEdicao] = useState('');
  const [local, setLocal] = useState('');
  const [editora, setEditora] = useState('');
  const [ano, setAno] = useState('');
  const [periodico, setPeriodico] = useState('');
  const [volume, setVolume] = useState('');
  const [numero, setNumero] = useState('');
  const [paginas, setPaginas] = useState('');
  const [url, setUrl] = useState('');
  const [dataAcesso, setDataAcesso] = useState('');
  const [chapterId, setChapterId] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setType('livro');
    setAutor('');
    setTitulo('');
    setSubtitulo('');
    setEdicao('');
    setLocal('');
    setEditora('');
    setAno('');
    setPeriodico('');
    setVolume('');
    setNumero('');
    setPaginas('');
    setUrl('');
    setDataAcesso('');
    setChapterId('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ref: ReferenceItem) => {
    setEditingId(ref.id);
    setType(ref.type);
    setAutor(ref.autor);
    setTitulo(ref.titulo);
    setSubtitulo(ref.subtitulo || '');
    setEdicao(ref.edicao || '');
    setLocal(ref.local || '');
    setEditora(ref.editora || '');
    setAno(ref.ano);
    setPeriodico(ref.periodico || '');
    setVolume(ref.volume || '');
    setNumero(ref.numero || '');
    setPaginas(ref.paginas || '');
    setUrl(ref.url || '');
    setDataAcesso(ref.dataAcesso || '');
    setChapterId(ref.chapterId || '');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!autor || !titulo || !ano) {
      alert('Por favor, preencha pelo menos os campos Autor, Título e Ano.');
      return;
    }

    const partialRef: Partial<ReferenceItem> = {
      type,
      autor,
      titulo,
      subtitulo,
      edicao,
      local,
      editora,
      ano,
      periodico,
      volume,
      numero,
      paginas,
      url,
      dataAcesso,
    };

    const formattedText = formatReference(partialRef);

    if (editingId) {
      // Edit existing
      const updated = references.map((r) =>
        r.id === editingId
          ? {
              ...r,
              ...partialRef,
              chapterId,
              formattedText,
            }
          : r
      );
      onChange(updated);
    } else {
      // Create new
      const newRef: ReferenceItem = {
        id: `ref-${Date.now()}`,
        type,
        autor,
        titulo,
        subtitulo,
        edicao,
        local,
        editora,
        ano,
        periodico,
        volume,
        numero,
        paginas,
        url,
        dataAcesso,
        chapterId,
        formattedText,
      };
      onChange([...references, newRef]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta referência bibliográfica?')) {
      onChange(references.filter((r) => r.id !== id));
    }
  };

  // Sort alphabetically by primary author surname
  const sortedReferences = [...references].sort((a, b) => a.autor.localeCompare(b.autor));

  return (
    <div className="space-y-6 animate-fadeIn transition-colors duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Quote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Referências Bibliográficas (ABNT NBR 6023)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cadastre suas fontes e obtenha a formatação ABNT padronizada em ordem alfabética.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center space-x-2 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova Referência</span>
        </button>
      </div>

      {/* Saved References List */}
      <div className="space-y-3">
        {sortedReferences.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <Quote className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhuma referência cadastrada</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Clique no botão "+ Nova Referência" para adicionar livros, artigos acadêmicos ou sites à sua bibliografia.
            </p>
          </div>
        ) : (
          sortedReferences.map((ref) => {
            const assocChapter = chapters.find((c) => c.id === ref.chapterId);

            return (
              <div
                key={ref.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        ref.type === 'livro'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : ref.type === 'artigo'
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {ref.type}
                    </span>

                    {assocChapter && (
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-md">
                        Cap. {assocChapter.number}: {assocChapter.title || 'Sem título'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-serif text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {ref.formattedText}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(ref)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-all cursor-pointer"
                    title="Editar referência"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ref.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-all cursor-pointer"
                    title="Excluir referência"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal / Form Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingId ? 'Editar Referência Bibliográfica' : 'Nova Referência NBR 6023'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>

            {/* Media Type Dropdown Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tipo de Fonte Bibliográfica</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ReferenceType)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 font-normal"
              >
                <option value="livro">Livro (Impresso ou Digital)</option>
                <option value="artigo">Artigo Acadêmico / Revista / Periódico</option>
                <option value="site">Site / Página de Internet</option>
              </select>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Autor(es) (Sobrenome em CAIXA ALTA, Nome)
                </label>
                <input
                  type="text"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  placeholder="Ex: SILVA, João Pedro; SANTOS, Carlos"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-1 focus:ring-emerald-500 font-normal"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Título da Obra / Artigo</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Metodologia da Pesquisa Científica"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-1 focus:ring-emerald-500 font-normal"
                />
              </div>

              {/* LIVRO SPECIFIC FIELDS */}
              {type === 'livro' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Edição (Se houver)</label>
                    <input
                      type="text"
                      value={edicao}
                      onChange={(e) => setEdicao(e.target.value)}
                      placeholder="Ex: 4"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Cidade / Local</label>
                    <input
                      type="text"
                      value={local}
                      onChange={(e) => setLocal(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Editora</label>
                    <input
                      type="text"
                      value={editora}
                      onChange={(e) => setEditora(e.target.value)}
                      placeholder="Editora Acadêmica"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                </>
              )}

              {/* ARTIGO SPECIFIC FIELDS */}
              {type === 'artigo' && (
                <>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Nome da Revista / Periódico</label>
                    <input
                      type="text"
                      value={periodico}
                      onChange={(e) => setPeriodico(e.target.value)}
                      placeholder="Revista Brasileira de Informática"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Volume (v.)</label>
                    <input
                      type="text"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder="30"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Número (n.)</label>
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="2"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Páginas (p.)</label>
                    <input
                      type="text"
                      value={paginas}
                      onChange={(e) => setPaginas(e.target.value)}
                      placeholder="45-62"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                </>
              )}

              {/* SITE SPECIFIC FIELDS */}
              {type === 'site' && (
                <>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">URL Completa</label>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.exemplo.com.br/artigo"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Data de Acesso</label>
                    <input
                      type="text"
                      value={dataAcesso}
                      onChange={(e) => setDataAcesso(e.target.value)}
                      placeholder="Ex: 10 nov. 2025"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Ano de Publicação</label>
                <input
                  type="text"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  placeholder="2025"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {/* Associate with Chapter */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Vincular a um Capítulo do TCC</label>
                <select
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  <option value="">Geral / Sem vínculo específico</option>
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Capítulo {ch.number}: {ch.title || 'Sem título'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 px-4 py-2 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all cursor-pointer"
              >
                Gerar Referência Formatada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
