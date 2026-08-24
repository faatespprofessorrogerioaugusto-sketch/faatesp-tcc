import { ReferenceItem, TccDocument } from '../types';

/**
 * Formats a reference according to ABNT NBR 6023 rules.
 */
export function formatReference(ref: Partial<ReferenceItem>): string {
  const autorUpper = ref.autor ? ref.autor.trim() : '';

  if (ref.type === 'livro') {
    // SOBRENOME, Nome. Título do livro: subtítulo. Edição. Cidade: Editora, Ano.
    const ed = ref.edicao ? ` ${ref.edicao} ed.` : '';
    const loc = ref.local ? `${ref.local}: ` : '';
    const edtr = ref.editora ? `${ref.editora}, ` : '';
    const sub = ref.subtitulo ? `: ${ref.subtitulo}` : '';
    return `${autorUpper}. ${ref.titulo}${sub}.${ed} ${loc}${edtr}${ref.ano || ''}.`;
  }

  if (ref.type === 'artigo') {
    // SOBRENOME, Nome. Título do artigo. Nome da Revista, Cidade, v. X, n. Y, p. AA-BB, Ano.
    const sub = ref.subtitulo ? `: ${ref.subtitulo}` : '';
    const per = ref.periodico ? ` ${ref.periodico},` : '';
    const loc = ref.local ? ` ${ref.local},` : '';
    const vol = ref.volume ? ` v. ${ref.volume},` : '';
    const num = ref.numero ? ` n. ${ref.numero},` : '';
    const pag = ref.paginas ? ` p. ${ref.paginas},` : '';
    return `${autorUpper}. ${ref.titulo}${sub}.${per}${loc}${vol}${num}${pag} ${ref.ano || ''}.`;
  }

  if (ref.type === 'site') {
    // AUTOR OU ENTIDADE. Título da página. Nome do site, Ano. Disponível em: <URL>. Acesso em: dia mês. ano.
    const urlStr = ref.url ? ` Disponível em: <${ref.url}>.` : '';
    const acs = ref.dataAcesso ? ` Acesso em: ${ref.dataAcesso}.` : '';
    return `${autorUpper}. ${ref.titulo}. ${ref.periodico || ''}, ${ref.ano || ''}.${urlStr}${acs}`;
  }

  return `${autorUpper}. ${ref.titulo}. ${ref.ano || ''}.`;
}

/**
 * Calculates overall document progress percentage (0 - 100%)
 */
export function calculateProgress(doc: TccDocument): {
  percentage: number;
  breakdown: Array<{ name: string; completed: boolean; score: number; detail: string }>;
} {
  const { preTextual, chapters, references } = doc;

  // 1. Capa e Folha de Rosto (10%)
  const capaFilled = Boolean(
    preTextual.instituicao &&
    preTextual.curso &&
    preTextual.autor &&
    preTextual.titulo &&
    preTextual.cidade &&
    preTextual.ano
  );

  // 2. Capítulos preenchidos (Até 60% - 20% para cada capítulo com texto, máx 3x20 = 60)
  const chaptersWithText = chapters.filter((c) => c.content.trim().length > 50).length;
  const chapterScore = Math.min(60, chaptersWithText * 20);

  // 3. Resumo e Abstract (10%)
  const resumosFilled = Boolean(
    preTextual.resumo.texto.trim().length > 30 &&
    preTextual.abstract.texto.trim().length > 30
  );

  // 4. Pelo menos 3 referências salvas (10%)
  const referencesFilled = references.length >= 3;

  // 5. Folha de Aprovação / Pré-Textuais (10%)
  const preTextualFilled = Boolean(
    preTextual.membrosBanca.length > 0 ||
    preTextual.dedicatoria ||
    preTextual.agradecimentos ||
    preTextual.epigrafe.texto
  );

  const total = (capaFilled ? 10 : 0) + chapterScore + (resumosFilled ? 10 : 0) + (referencesFilled ? 10 : 0) + (preTextualFilled ? 10 : 0);

  return {
    percentage: Math.min(100, total),
    breakdown: [
      {
        name: 'Capa e Folha de Rosto',
        completed: capaFilled,
        score: 10,
        detail: capaFilled ? 'Preenchido' : 'Pendente (Instituição, Autor, Título)',
      },
      {
        name: 'Capítulos com Conteúdo',
        completed: chaptersWithText >= 3,
        score: chapterScore,
        detail: `${chaptersWithText} de no mínimo 3 capítulos preenchidos (+20% cada)`,
      },
      {
        name: 'Resumo e Abstract',
        completed: resumosFilled,
        score: 10,
        detail: resumosFilled ? 'RESUMO e ABSTRACT completos' : 'Pendente de escrita',
      },
      {
        name: 'Banco de Citações (NBR 6023)',
        completed: referencesFilled,
        score: referencesFilled ? 10 : 0,
        detail: `${references.length}/3 referências acadêmicas salvas`,
      },
      {
        name: 'Elementos Pré-Textuais',
        completed: preTextualFilled,
        score: 10,
        detail: preTextualFilled ? 'Banca examinadora / Seções configuradas' : 'Dedicatória, Agradecimentos ou Banca',
      },
    ],
  };
}

/**
 * Formats full author name into AACR2 / ABNT cataloguing format (Sobrenome, Nome)
 * Ex: "Ana Cristina Ribeiro do Nascimento" -> "Ribeiro do Nascimento, Ana Cristina."
 * Ex: "Ribeiro do Nascimento, Ana Cristina" -> "Ribeiro do Nascimento, Ana Cristina."
 */
export function formatAuthorForCatalog(fullName: string): string {
  if (!fullName || !fullName.trim()) return '';
  const clean = fullName.trim().replace(/\s+/g, ' ');

  // If already formatted with comma (e.g. "Ribeiro do Nascimento, Ana Cristina")
  if (clean.includes(',')) {
    return clean.endsWith('.') ? clean : `${clean}.`;
  }

  const parts = clean.split(' ');
  if (parts.length === 1) return `${parts[0]}.`;

  // Determine compound surname start (e.g. "do Nascimento", "da Silva")
  let lastNameStart = parts.length - 1;
  if (parts.length >= 3) {
    const secondToLast = parts[parts.length - 2].toLowerCase();
    if (['de', 'da', 'do', 'dos', 'das'].includes(secondToLast)) {
      lastNameStart = parts.length - 2;
      if (parts.length >= 4) {
        lastNameStart = parts.length - 3;
      }
    }
  }

  const surnameParts = parts.slice(lastNameStart);
  const firstNameParts = parts.slice(0, lastNameStart);

  const formatWord = (w: string) => {
    const lower = w.toLowerCase();
    if (['de', 'da', 'do', 'dos', 'das', 'e'].includes(lower)) return lower;
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  };

  const surnameStr = surnameParts.map(formatWord).join(' ');
  const firstNameStr = firstNameParts.map(formatWord).join(' ');

  return `${surnameStr}, ${firstNameStr}.`;
}

/**
 * Normalizes and extracts structured Ficha Catalográfica content0
 */
export function getFichaCatalograficaContent(preTextual: TccDocument['preTextual']) {
  const ficha = preTextual.fichaCatalografica;
  const autorCompleto = preTextual.autor || 'Ribeiro do Nascimento, Ana Cristina.';

  const rawAutor =
    ficha?.autorFormatado && ficha.autorFormatado.trim()
      ? ficha.autorFormatado
      : autorCompleto;

  const autorCatalog = formatAuthorForCatalog(rawAutor);

  const titulo = preTextual.titulo || 'A ciência da venda: um estudo sobre a implementação do Inside Sales em empresas de tecnologia.';
  const subtitulo = preTextual.subtitulo ? `: ${preTextual.subtitulo}` : '';
  const rawTituloCompleto = `${titulo}${subtitulo}`;
  const tituloCompleto = rawTituloCompleto.endsWith('.') ? rawTituloCompleto : `${rawTituloCompleto}.`;

  const orientadorRaw = preTextual.orientador?.trim() || 'Profa. Marinês Rodrigues de Borba';
  const orientadorClean = orientadorRaw.replace(/^Orientação:\s*/i, '').replace(/\.$/, '');
  const orientacao = `Orientação: ${orientadorClean}.`;
  const coorientacao = preTextual.coorientador ? `Coorientação: ${preTextual.coorientador.trim().replace(/\.$/, '')}.` : null;

  const cidade = ficha?.cidade || preTextual.cidade || 'São Paulo';
  const ano = ficha?.ano || preTextual.ano || '2026';
  const cidadeAno = `${cidade}, ${ano}.`;

  const paginasVal = ficha?.paginas !== undefined ? ficha.paginas : 'a preencher após a finalização da paginação.';
  const numeroPaginas =
    paginasVal.toLowerCase().startsWith('número de páginas:') ||
    paginasVal.toLowerCase().startsWith('numero de paginas:')
      ? paginasVal
      : `Número de páginas: ${paginasVal}${paginasVal ? (paginasVal.endsWith('.') ? '' : '.') : ''}`;

  const isPedagogia =
    (preTextual.naturezaTrabalho && preTextual.naturezaTrabalho.toLowerCase().includes('pedagogia')) ||
    (preTextual.curso && preTextual.curso.toLowerCase().includes('pedagogia'));

  const defaultNatureza = isPedagogia
    ? 'Monografia apresentada como exigência parcial para conclusão do curso de Licenciatura em Pedagogia da Faculdade Álvares de Azevedo.'
    : 'Monografia apresentada como exigência parcial para conclusão do curso de Bacharelado em Administração da Faculdade Álvares de Azevedo.';

  const naturezaTrabalho = preTextual.naturezaTrabalho?.trim() || defaultNatureza;

  // Keywords / Palavras-chave
  const assuntosList =
    ficha?.assuntos && ficha.assuntos.length > 0
      ? ficha.assuntos
      : preTextual.resumo.palavrasChave.length > 0
      ? preTextual.resumo.palavrasChave
      : ['Inside Sales', 'Vendas', 'Tecnologia', 'CAC', 'Estratégias comerciais'];

  const palavrasChaveTexto = `Palavras-chave: ${assuntosList.map((a) => a.replace(/\.$/, '')).join('. ')}.`;

  return {
    autorCatalog,
    tituloCompleto,
    orientacao,
    coorientacao,
    cidadeAno,
    numeroPaginas,
    naturezaTrabalho,
    palavrasChaveTexto,
    incluirFicha: ficha?.incluirFicha !== false,
  };
}

/**
 * Calculates page indexing according to ABNT "Regra de Ouro":
 * Count starts at Folha de Rosto (Folha de Rosto = Page 1 or Capa = Page 1, Folha de Rosto = Page 2).
 * Display only starts at INTRODUÇÃO (first textual element).
 */
export function calculateDocumentPageMap(doc: TccDocument) {
  let currentPage = 1; // Folha de Rosto is counted as page 1 (Capa is not numbered or uncounted)

  const incluirFicha = doc.preTextual.fichaCatalografica?.incluirFicha !== false;

  // Pre-textual sequence
  const preTextualPages = [
    { key: 'folhaDeRosto', title: 'Folha de Rosto', page: currentPage++, display: false },
    { key: 'fichaCatalografica', title: 'Ficha Catalográfica', page: incluirFicha ? currentPage++ : null, display: false },
    { key: 'errata', title: 'Errata', page: doc.preTextual.errataEntries.length > 0 ? currentPage++ : null, display: false },
    { key: 'folhaAprovacao', title: 'Folha de Aprovação', page: currentPage++, display: false },
    { key: 'dedicatoria', title: 'Dedicatória', page: doc.preTextual.dedicatoria ? currentPage++ : null, display: false },
    { key: 'agradecimentos', title: 'Agradecimentos', page: doc.preTextual.agradecimentos ? currentPage++ : null, display: false },
    { key: 'epigrafe', title: 'Epígrafe', page: doc.preTextual.epigrafe.texto ? currentPage++ : null, display: false },
    { key: 'resumo', title: 'Resumo em Português', page: currentPage++, display: false },
    { key: 'abstract', title: 'Abstract (Inglês)', page: currentPage++, display: false },
    { key: 'listaIlustracoes', title: 'Lista de Ilustrações', page: doc.preTextual.listaIlustracoes.length > 0 ? currentPage++ : null, display: false },
    { key: 'listaTabelas', title: 'Lista de Tabelas', page: doc.preTextual.listaTabelas.length > 0 ? currentPage++ : null, display: false },
    { key: 'listaSiglas', title: 'Lista de Siglas', page: doc.preTextual.listaSiglas.length > 0 ? currentPage++ : null, display: false },
    { key: 'sumario', title: 'Sumário', page: currentPage++, display: false },
  ].filter((item) => item.page !== null);

  // Textual elements (Chapters) start page numbering display
  const chapterPages = doc.chapters.map((ch) => {
    const chapterStartPage = currentPage;

    // Estimate page length based on word count (approx 250 words per page)
    const wordCount = ch.content.split(/\s+/).filter(Boolean).length;
    const pageSpan = Math.max(1, Math.ceil(wordCount / 250));
    currentPage += pageSpan;

    return {
      chapterId: ch.id,
      title: `${ch.number} ${ch.title}`,
      page: chapterStartPage,
      display: true, // DISPLAY NUMBER IN TOP RIGHT CORNER!
    };
  });

  const referencesPage = currentPage;

  return {
    preTextualPages,
    chapterPages,
    referencesPage,
    totalPages: currentPage,
  };
}
