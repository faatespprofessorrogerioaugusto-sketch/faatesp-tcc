import React, { useState } from 'react';
import { PreTextualData, CommitteeMember } from '../types';
import { Plus, Trash2, BookOpen, User, Building, Award, Heart, MessageSquare, Sparkles, Library, CheckCircle2 } from 'lucide-react';
import { getFichaCatalograficaContent, formatAuthorForCatalog } from '../utils/abntFormatter';

export const NATUREZA_OPTIONS = [
  {
    id: 'administracao',
    label: 'Bacharelado em Administração',
    curso: 'CURSO DE BACHARELADO EM ADMINISTRAÇÃO',
    text: 'Monografia apresentada como exigência parcial para conclusão do curso de Bacharelado em Administração da Faculdade Álvares de Azevedo.',
  },
  {
    id: 'pedagogia',
    label: 'Licenciatura em Pedagogia',
    curso: 'CURSO DE LICENCIATURA EM PEDAGOGIA',
    text: 'Monografia apresentada como exigência parcial para conclusão do curso de Licenciatura em Pedagogia da Faculdade Álvares de Azevedo.',
  },
];

interface PreTextualEditorProps {
  data: PreTextualData;
  onChange: (data: PreTextualData) => void;
}

export const PreTextualEditor: React.FC<PreTextualEditorProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<
    'capa' | 'rosto' | 'ficha' | 'aprovacao' | 'resumo' | 'abstract' | 'dedicatoria'
  >('capa');
  const [palavrasChaveRaw, setPalavrasChaveRaw] = useState<string | null>(null);
  const [keywordsRaw, setKeywordsRaw] = useState<string | null>(null);
  const [assuntosRaw, setAssuntosRaw] = useState<string | null>(null);

  const selectCursoNatureza = (opt: (typeof NATUREZA_OPTIONS)[0]) => {
    onChange({
      ...data,
      curso: opt.curso,
      naturezaTrabalho: opt.text,
    });
  };

  const updateField = (field: keyof PreTextualData, value: any) => {
    if (field === 'curso') {
      const isPedagogia = typeof value === 'string' && value.toLowerCase().includes('pedagogia');
      const isAdmin = typeof value === 'string' && (value.toLowerCase().includes('administra') || value.toLowerCase().includes('adm'));
      
      let newNatureza = data.naturezaTrabalho;
      if (isPedagogia) {
        newNatureza = 'Monografia apresentada como exigência parcial para conclusão do curso de Licenciatura em Pedagogia da Faculdade Álvares de Azevedo.';
      } else if (isAdmin) {
        newNatureza = 'Monografia apresentada como exigência parcial para conclusão do curso de Bacharelado em Administração da Faculdade Álvares de Azevedo.';
      }
      onChange({ ...data, [field]: value, naturezaTrabalho: newNatureza });
    } else {
      onChange({ ...data, [field]: value });
    }
  };

  const updateFicha = (field: string, value: any) => {
    const currentFicha = data.fichaCatalografica || {
      codigoCutter: 'O48a',
      autorFormatado: formatAuthorForCatalog(data.autor),
      cidade: data.cidade,
      ano: data.ano,
      paginas: '85 f. : il.',
      assuntos: ['Inteligência Artificial', 'Normas ABNT'],
      cddCdu: 'CDU 004',
      bibliotecario: '',
      incluirFicha: true,
    };
    onChange({
      ...data,
      fichaCatalografica: {
        ...currentFicha,
        [field]: value,
      },
    });
  };

  const fichaContent = getFichaCatalograficaContent(data);

  const handleAddMember = () => {
    const newMember: CommitteeMember = {
      id: Date.now().toString(),
      name: '',
      title: 'Membro da Banca',
      institution: '',
    };
    onChange({
      ...data,
      membrosBanca: [...data.membrosBanca, newMember],
    });
  };

  const handleRemoveMember = (id: string) => {
    onChange({
      ...data,
      membrosBanca: data.membrosBanca.filter((m) => m.id !== id),
    });
  };

  const handleMemberChange = (id: string, field: keyof CommitteeMember, value: string) => {
    onChange({
      ...data,
      membrosBanca: data.membrosBanca.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Sub-header Navigation Tabs */}
      <div className="bg-slate-900 text-white p-2 sm:p-4 border-b border-slate-800 flex items-center space-x-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('capa')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'capa' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          1. Capa
        </button>
        <button
          onClick={() => setActiveTab('rosto')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'rosto' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          2. Folha de Rosto
        </button>
        <button
          onClick={() => setActiveTab('ficha')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'ficha' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          3. Ficha Catalográfica
        </button>
        <button
          onClick={() => setActiveTab('aprovacao')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'aprovacao' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          4. Folha de Aprovação
        </button>
        <button
          onClick={() => setActiveTab('resumo')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'resumo' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          5. Resumo (PT)
        </button>
        <button
          onClick={() => setActiveTab('abstract')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'abstract' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          6. Abstract (EN)
        </button>
        <button
          onClick={() => setActiveTab('dedicatoria')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'dedicatoria' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          7. Dedicatória & Epígrafe
        </button>
      </div>

      <div className="p-6">
        {/* TAB 1: CAPA */}
        {activeTab === 'capa' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Informações da Capa (Elemento Obrigatório)</span>
              </h3>
              <p className="text-xs text-slate-500">
                A Capa é o primeiro elemento do trabalho. Ela conta na estrutura, porém a numeração não aparece na página.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">Nome da Instituição (Caixa Alta)</label>
                <input
                  type="text"
                  value={data.instituicao}
                  onChange={(e) => updateField('instituicao', e.target.value.toUpperCase())}
                  placeholder="EX: UNIVERSIDADE FEDERAL DE TECNOLOGIA"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Curso / Faculdade</label>
                  <span className="text-[11px] text-slate-400">Escolha rápida:</span>
                </div>
                <input
                  type="text"
                  value={data.curso}
                  onChange={(e) => updateField('curso', e.target.value.toUpperCase())}
                  placeholder="EX: CURSO DE BACHARELADO EM ADMINISTRAÇÃO"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {NATUREZA_OPTIONS.map((opt) => {
                    const isPedag =
                      (data.curso || '').toLowerCase().includes('pedagogia') ||
                      (data.naturezaTrabalho || '').toLowerCase().includes('pedagogia');
                    const isSelected = opt.id === 'pedagogia' ? isPedag : !isPedag;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => selectCursoNatureza(opt)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-400'}`} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">Nome do Autor (Caixa Alta)</label>
                <input
                  type="text"
                  value={data.autor}
                  onChange={(e) => updateField('autor', e.target.value.toUpperCase())}
                  placeholder="EX: NEYMAR JÚNIOR"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">Título do Trabalho (Caixa Alta e Negrito)</label>
                <input
                  type="text"
                  value={data.titulo}
                  onChange={(e) => updateField('titulo', e.target.value.toUpperCase())}
                  placeholder="EX: INTELIGÊNCIA ARTIFICIAL NA REDAÇÃO ACADÊMICA"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal uppercase"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">Subtítulo (Se houver - sem caixa alta obrigatória)</label>
                <input
                  type="text"
                  value={data.subtitulo}
                  onChange={(e) => updateField('subtitulo', e.target.value)}
                  placeholder="Ex: Um estudo de caso sobre produtividade e conformidade ABNT"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Cidade (Local da Instituição)</label>
                <input
                  type="text"
                  value={data.cidade}
                  onChange={(e) => updateField('cidade', e.target.value.toUpperCase())}
                  placeholder="SÃO PAULO"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Ano de Entrega</label>
                <input
                  type="text"
                  value={data.ano}
                  onChange={(e) => updateField('ano', e.target.value)}
                  placeholder="2026"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FOLHA DE ROSTO */}
        {activeTab === 'rosto' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Folha de Rosto (Elemento Obrigatório)</span>
              </h3>
              <p className="text-xs text-slate-500">
                A contagem oficial de páginas do documento ABNT começa visualmente nesta folha (Página 1).
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700">
                  Selecione o Curso / Texto de Natureza do Trabalho:
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {NATUREZA_OPTIONS.map((opt) => {
                    const isPedag =
                      (data.naturezaTrabalho || '').toLowerCase().includes('pedagogia') ||
                      (data.curso || '').toLowerCase().includes('pedagogia');
                    const isSelected = opt.id === 'pedagogia' ? isPedag : !isPedag;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => selectCursoNatureza(opt)}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 text-blue-900 font-medium shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs mb-1.5">
                          <span className="flex items-center space-x-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`} />
                            <span>{opt.label}</span>
                          </span>
                          {isSelected && (
                            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                              Selecionado
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] opacity-85 leading-snug">{opt.text}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-700">Texto Completo da Natureza do Trabalho</label>
                  <textarea
                    rows={3}
                    value={data.naturezaTrabalho || ''}
                    onChange={(e) => updateField('naturezaTrabalho', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans mt-1 text-slate-700 font-normal"
                    placeholder="Monografia apresentada como exigência parcial..."
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    * Na visualização ABNT, este texto é alinhado do meio da página para a margem direita (recuo de 7-8cm) com espaçamento simples (1,0) e fonte 10pt.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nome do Orientador</label>
                  <input
                    type="text"
                    value={data.orientador}
                    onChange={(e) => updateField('orientador', e.target.value)}
                    placeholder="Ex: Prof. Wanderley Luxemborgo da Silva"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nome do Coorientador (Opcional)</label>
                  <input
                    type="text"
                    value={data.coorientador || ''}
                    onChange={(e) => updateField('coorientador', e.target.value)}
                    placeholder="Profa. Dra. Nome da Coorientadora"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FICHA CATALOGRÁFICA */}
        {activeTab === 'ficha' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Library className="w-5 h-5 text-blue-600" />
                  <span>Ficha Catalográfica (Elemento Pré-Textual Obrigatório)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Estruturada no formato de quadro oficial (com cabeçalho em caixa destacada e informações organizadas).
                </p>
              </div>

              {/* Inclusion Toggle */}
              <label className="inline-flex items-center space-x-2 cursor-pointer bg-slate-100 hover:bg-slate-200 p-2.5 rounded-xl transition-all border border-slate-200 shrink-0">
                <input
                  type="checkbox"
                  checked={data.fichaCatalografica?.incluirFicha !== false}
                  onChange={(e) => updateFicha('incluirFicha', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Incluir no Documento Final
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Nome do Autor (Formato ABNT: Sobrenome, Nome)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (data.autor) {
                        updateFicha('autorFormatado', formatAuthorForCatalog(data.autor));
                      }
                    }}
                    className="text-[11px] text-blue-600 font-bold hover:underline flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-gerar</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={
                    data.fichaCatalografica?.autorFormatado ??
                    formatAuthorForCatalog(data.autor)
                  }
                  onChange={(e) => updateFicha('autorFormatado', e.target.value)}
                  placeholder="Ex: Ribeiro do Nascimento, Ana Cristina."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                />
              </div>

              <div className="space-y-2 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Curso / Requisito (Ficha Catalográfica e Folha de Rosto):</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {NATUREZA_OPTIONS.map((opt) => {
                    const isPedag =
                      (data.naturezaTrabalho || '').toLowerCase().includes('pedagogia') ||
                      (data.curso || '').toLowerCase().includes('pedagogia');
                    const isSelected = opt.id === 'pedagogia' ? isPedag : !isPedag;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => selectCursoNatureza(opt)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 text-blue-900 shadow-sm font-medium'
                            : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs mb-1">
                          <span className="flex items-center space-x-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`} />
                            <span>{opt.label}</span>
                          </span>
                          {isSelected && (
                            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                              Selecionado
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{opt.text}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Orientador(a)
                </label>
                <input
                  type="text"
                  value={data.orientador || ''}
                  onChange={(e) => updateField('orientador', e.target.value)}
                  placeholder="Ex: Prof. Wanderley Luxemborgo da Silva"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Número de Páginas
                </label>
                <input
                  type="text"
                  value={data.fichaCatalografica?.paginas || ''}
                  onChange={(e) => updateFicha('paginas', e.target.value)}
                  placeholder="Ex: 85 f. : il."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Palavras-chave para a Ficha (Separadas por ponto e vírgula)
                </label>
                <input
                  type="text"
                  value={
                    assuntosRaw !== null
                      ? assuntosRaw
                      : (data.fichaCatalografica?.assuntos || []).join('; ')
                  }
                  onChange={(e) => {
                    const raw = e.target.value;
                    setAssuntosRaw(raw);
                    const parsed = raw.split(';').map((s) => s.trim()).filter(Boolean);
                    updateFicha('assuntos', parsed);
                  }}
                  onBlur={() => setAssuntosRaw(null)}
                  placeholder="Ex: Vendas; Tecnologia; Estratégias comerciais"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal font-mono"
                />
              </div>
            </div>

            {/* LIVE PREVIEW OF THE EXACT FICHA CATALOGRÁFICA FROM IMAGE */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Pré-visualização do Modelo de Ficha Catalográfica:</span>
              </label>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex justify-center">
                <div className="w-full max-w-[560px] bg-white text-xs font-sans shadow-sm">
                  {/* Top Box */}
                  <div className="border border-slate-900 p-2 text-center font-bold text-slate-900 text-xs tracking-wider uppercase">
                    FICHA CATALOGRÁFICA
                  </div>

                  {/* Content Box attached below */}
                  <div className="border border-slate-900 border-t-0 p-5 space-y-3.5 text-slate-900 leading-relaxed">
                    <p className="font-normal">{fichaContent.autorCatalog}</p>
                    <p className="font-normal">{fichaContent.tituloCompleto}</p>
                    <p className="font-normal">{fichaContent.orientacao}</p>
                    {fichaContent.coorientacao && <p className="font-normal">{fichaContent.coorientacao}</p>}
                    <p className="font-normal">{fichaContent.cidadeAno}</p>
                    <p className="font-normal">{fichaContent.numeroPaginas}</p>
                    <p className="font-normal">{fichaContent.naturezaTrabalho}</p>
                    <p className="font-normal">{fichaContent.palavrasChaveTexto}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FOLHA DE APROVAÇÃO */}
        {activeTab === 'aprovacao' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Folha de Aprovação & Banca Examinadora</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Insira os membros da banca examinadora que assinarão o documento final.
                </p>
              </div>
              <button
                onClick={handleAddMember}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Membro</span>
              </button>
            </div>

            {/* List of Committee Members */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700">Membros da Banca Examinadora</label>
              {data.membrosBanca.length === 0 && (
                <p className="text-xs text-slate-400 italic">Nenhum membro da banca adicionado ainda.</p>
              )}

              {data.membrosBanca.map((member, index) => (
                <div
                  key={member.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 items-center relative"
                >
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Nome Completo</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                      placeholder="Prof. Dr. Nome do Membro"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-blue-500 text-slate-700 font-normal"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Título / Função na Banca</label>
                    <input
                      type="text"
                      value={member.title}
                      onChange={(e) => handleMemberChange(member.id, 'title', e.target.value)}
                      placeholder="Ex: Presidente / Membro Interno"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-blue-500 text-slate-700 font-normal"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-500">Instituição</label>
                      <input
                        type="text"
                        value={member.institution}
                        onChange={(e) => handleMemberChange(member.id, 'institution', e.target.value)}
                        placeholder="Ex: UFTC / USP"
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-blue-500 text-slate-700 font-normal"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-lg transition-all mt-4"
                      title="Remover membro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESUMO */}
        {activeTab === 'resumo' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Resumo em Português (Elemento Obrigatório)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Texto em parágrafo único, de 150 a 500 palavras, espaçamento simples (1,0) e sem recuo na primeira linha.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Texto do Resumo</label>
                <textarea
                  rows={8}
                  value={data.resumo.texto}
                  onChange={(e) =>
                    updateField('resumo', { ...data.resumo, texto: e.target.value })
                  }
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans text-slate-700 font-normal"
                  placeholder="Escreva um texto síntese entre 150 e 500 palavras..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Palavras-chave (Separadas por ponto e vírgula)
                </label>
                <input
                  type="text"
                  value={
                    palavrasChaveRaw !== null
                      ? palavrasChaveRaw
                      : data.resumo.palavrasChave.join('; ')
                  }
                  onChange={(e) => {
                    const raw = e.target.value;
                    setPalavrasChaveRaw(raw);
                    const parsed = raw.split(';').map((s) => s.trim()).filter(Boolean);
                    updateField('resumo', {
                      ...data.resumo,
                      palavrasChave: parsed,
                    });
                  }}
                  onBlur={() => setPalavrasChaveRaw(null)}
                  placeholder="Automação; Inteligência Artificial; ABNT."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono text-slate-700 font-normal"
                />
                <p className="text-[11px] text-slate-400">
                  Exemplo de saída ABNT: Palavras-chave: Automação; Inteligência Artificial; ABNT.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ABSTRACT */}
        {activeTab === 'abstract' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Resumo em Língua Estrangeira / Abstract (Obrigatório)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Versão traduzida exata do resumo para o inglês com Keywords.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Texto do Abstract</label>
                <textarea
                  rows={8}
                  value={data.abstract.texto}
                  onChange={(e) =>
                    updateField('abstract', { ...data.abstract, texto: e.target.value })
                  }
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans text-slate-700 font-normal"
                  placeholder="This thesis investigates..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Keywords (Separadas por ponto e vírgula)
                </label>
                <input
                  type="text"
                  value={
                    keywordsRaw !== null
                      ? keywordsRaw
                      : data.abstract.keywords.join('; ')
                  }
                  onChange={(e) => {
                    const raw = e.target.value;
                    setKeywordsRaw(raw);
                    const parsed = raw.split(';').map((s) => s.trim()).filter(Boolean);
                    updateField('abstract', {
                      ...data.abstract,
                      keywords: parsed,
                    });
                  }}
                  onBlur={() => setKeywordsRaw(null)}
                  placeholder="Artificial Intelligence; Academic Automation; ABNT Standards."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono text-slate-700 font-normal"
                />
                <p className="text-[11px] text-slate-400">
                  Exemplo de saída ABNT: Keywords: Artificial Intelligence; Academic Automation; ABNT Standards.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DEDICATÓRIA & EPÍGRAFE */}
        {activeTab === 'dedicatoria' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-blue-600" />
                <span>Dedicatória, Agradecimentos e Epígrafe (Elementos Opcionais)</span>
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Dedicatória</label>
                <textarea
                  rows={3}
                  value={data.dedicatoria}
                  onChange={(e) => updateField('dedicatoria', e.target.value)}
                  placeholder="Dedico este trabalho..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Agradecimentos</label>
                <textarea
                  rows={4}
                  value={data.agradecimentos}
                  onChange={(e) => updateField('agradecimentos', e.target.value)}
                  placeholder="Agradeço a meus pais..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Epígrafe (Citação)</label>
                  <input
                    type="text"
                    value={data.epigrafe.texto}
                    onChange={(e) =>
                      updateField('epigrafe', { ...data.epigrafe, texto: e.target.value })
                    }
                    placeholder="Ex: A mente que se abre a uma nova ideia..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 italic text-slate-700 font-normal"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Autor da Citação</label>
                  <input
                    type="text"
                    value={data.epigrafe.autor}
                    onChange={(e) =>
                      updateField('epigrafe', { ...data.epigrafe, autor: e.target.value })
                    }
                    placeholder="Albert Einstein"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 font-normal"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
