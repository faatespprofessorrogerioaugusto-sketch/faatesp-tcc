export type FontType = 'Arial' | 'Times New Roman';

export type ReferenceType = 'livro' | 'artigo' | 'site';

export interface ReferenceItem {
  id: string;
  type: ReferenceType;
  // Livro fields
  autor: string; // SOBRENOME, Nome
  titulo: string;
  subtitulo?: string;
  edicao?: string;
  local?: string; // Cidade
  editora?: string;
  ano: string;
  // Artigo fields
  periodico?: string;
  volume?: string;
  numero?: string;
  paginas?: string;
  // Site fields
  url?: string;
  dataAcesso?: string; // Ex: 10 out. 2024
  // Associated chapter
  chapterId?: string;
  formattedText: string;
}

export interface SubSection {
  id: string;
  number: string; // Ex: "1.1"
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
  number: number; // 1, 2, 3...
  title: string; // Ex: "INTRODUÇÃO"
  content: string; // Main text for this chapter
  subsections: SubSection[];
  pageNumber?: number; // Calculated page start
}

export interface CommitteeMember {
  id: string;
  name: string;
  title: string; // Ex: Prof. Dr.
  institution: string;
}

export interface FichaCatalograficaData {
  codigoCutter: string;
  autorFormatado: string;
  cidade: string;
  ano: string;
  paginas: string;
  assuntos: string[];
  cddCdu: string;
  bibliotecario?: string;
  incluirFicha: boolean;
}

export interface PreTextualData {
  // Capa & Folha de Rosto
  instituicao: string;
  curso: string;
  autor: string;
  titulo: string;
  subtitulo: string;
  cidade: string;
  ano: string;
  naturezaTrabalho: string;
  orientador: string;
  coorientador?: string;

  // Ficha Catalográfica (Obrigatório ABNT NBR 14724 / AACR2)
  fichaCatalografica: FichaCatalograficaData;

  // Errata (Opcional)
  errataEntries: Array<{ folha: string; linha: string; ondeDiz: string; leiaSe: string }>;

  // Folha de Aprovação
  dataAprovacao: string;
  membrosBanca: CommitteeMember[];

  // Dedicatória, Agradecimentos, Epígrafe
  dedicatoria: string;
  agradecimentos: string;
  epigrafe: {
    texto: string;
    autor: string;
  };

  // Resumos
  resumo: {
    texto: string;
    palavrasChave: string[];
  };
  abstract: {
    texto: string;
    keywords: string[];
  };

  // Listas Opcionais
  listaIlustracoes: Array<{ num: string; descricao: string; pagina: number }>;
  listaTabelas: Array<{ num: string; descricao: string; pagina: number }>;
  listaSiglas: Array<{ sigla: string; significado: string }>;
}

export interface TccDocument {
  id: string;
  fontType: FontType;
  preTextual: PreTextualData;
  chapters: Chapter[];
  references: ReferenceItem[];
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  isLoggedIn: boolean;
}
