import React from 'react';
import { FontType, UserProfile } from '../types';
import { FileText, Download, User, LogIn, Sparkles, Settings2, FileCheck } from 'lucide-react';

interface HeaderProps {
  fontType: FontType;
  onFontChange: (font: FontType) => void;
  user: UserProfile;
  onOpenLogin: () => void;
  onLogout?: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  fontType,
  onFontChange,
  user,
  onOpenLogin,
  onLogout,
  onExportDocx,
  onExportPdf,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-6">
          {/* Brand */}
          <div className="flex items-center space-x-3 shrink-0 mr-4">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl shadow-md flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white whitespace-nowrap">
                  {(!user.isLoggedIn || activeTab === 'login') ? 'TCC MAKER BY MISTER ROGER - FAATESP' : 'TCC MAKER - FAATESP'}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block whitespace-nowrap">
                Gerador e Editor Acadêmico Inteligente
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Hidden when not logged in */}
          {user.isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 ml-auto mr-2 shrink-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('pre-textual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'pre-textual'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Pré-Textuais
              </button>
              <button
                onClick={() => setActiveTab('chapters')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'chapters'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Textuais
              </button>
              <button
                onClick={() => setActiveTab('references')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'references'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Pós-Textuais
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'preview'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Visualização A4
              </button>
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Font Toggle */}
            {user.isLoggedIn && (
              <div className="hidden lg:flex items-center space-x-2 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
                <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Fonte ABNT:</span>
                <select
                  value={fontType}
                  onChange={(e) => onFontChange(e.target.value as FontType)}
                  className="bg-slate-900 text-white font-medium px-2 py-0.5 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>
            )}

            {/* Export Quick Buttons */}
            {user.isLoggedIn && (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onExportDocx}
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all border border-blue-400/30 cursor-pointer"
                  title="Baixar arquivo DOCX formatado em ABNT"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOCX</span>
                </button>
                <button
                  type="button"
                  onClick={onExportPdf}
                  className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all border border-emerald-400/30 cursor-pointer"
                  title="Baixar arquivo PDF formatado em ABNT"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            )}

            {/* Google User Profile */}
            {user.isLoggedIn ? (
              <div className="flex items-center space-x-2 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700/80 text-xs">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-400/30 shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate text-slate-200">
                  {user.name ? user.name.split(' ')[0] : 'Usuário'}
                </span>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="ml-1 text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded transition-all"
                    title="Sair totalmente da conta"
                  >
                    Sair
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        {user.isLoggedIn && (
          <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-800 overflow-x-auto space-x-1 no-scrollbar">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('pre-textual')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'pre-textual' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Pré-Textuais
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'chapters' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Textuais
            </button>
            <button
              onClick={() => setActiveTab('references')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'references' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Pós-Textuais
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'preview' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              A4
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
