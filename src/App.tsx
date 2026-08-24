import React, { useState, useEffect } from 'react';
import { TccDocument, FontType, UserProfile } from './types';
import { getEmptyTccDocument, initialTccDocument } from './data/defaultDoc';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PreTextualEditor } from './components/PreTextualEditor';
import { ChapterManager } from './components/ChapterManager';
import { ReferenceManager } from './components/ReferenceManager';
import { AbntPreview } from './components/AbntPreview';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LoginPage } from './components/LoginPage';
import { ExportModal } from './components/ExportModal';
import { exportTccToDocx } from './utils/docxExport';

export default function App() {
  const [doc, setDoc] = useState<TccDocument>(getEmptyTccDocument());
  const [activeTab, setActiveTab] = useState<string>('login');

  // Google User Auth State
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    avatarUrl: '',
    isLoggedIn: false,
  });

  // Modal Controls
  const [isExportOpen, setIsExportOpen] = useState(false);

  // AI Assistant Drawer State
  const [aiModal, setAiModal] = useState<{
    isOpen: boolean;
    chapterId: string;
    chapterTitle: string;
    currentText: string;
  }>({
    isOpen: false,
    chapterId: '',
    chapterTitle: '',
    currentText: '',
  });

  // Initialize application - ALWAYS start at the Login screen first
  useEffect(() => {
    setActiveTab('login');
    const savedUser = localStorage.getItem('tcc_current_user');
    if (savedUser) {
      try {
        const parsedUser: UserProfile = JSON.parse(savedUser);
        // Keep name and email for convenience, but require logging in
        setUser({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          avatarUrl: parsedUser.avatarUrl || '',
          isLoggedIn: false,
        });
      } catch (e) {
        console.error('Erro ao carregar sessão', e);
      }
    } else {
      setUser({
        name: '',
        email: '',
        avatarUrl: '',
        isLoggedIn: false,
      });
    }
    setDoc(getEmptyTccDocument());
  }, []);

  // Save document state per logged-in user
  useEffect(() => {
    if (user.isLoggedIn && user.email) {
      const docKey = `tcc_doc_${user.email.toLowerCase().trim()}`;
      localStorage.setItem(docKey, JSON.stringify(doc));
    }
  }, [doc, user]);

  // Handlers
  const handleFontChange = (newFont: FontType) => {
    setDoc((prev) => ({ ...prev, fontType: newFont }));
  };

  const handleLogout = () => {
    setUser({
      name: '',
      email: '',
      avatarUrl: '',
      isLoggedIn: false,
    });
    localStorage.removeItem('tcc_current_user');
    setDoc(getEmptyTccDocument());
    setActiveTab('login');
  };

  const handleLogin = (account: { name: string; email: string; avatarUrl?: string }) => {
    const newUser: UserProfile = {
      name: account.name,
      email: account.email,
      avatarUrl: account.avatarUrl || '',
      isLoggedIn: true,
    };
    setUser(newUser);
    localStorage.setItem('tcc_current_user', JSON.stringify(newUser));

    const docKey = `tcc_doc_${account.email.toLowerCase().trim()}`;
    const existingDoc = localStorage.getItem(docKey);
    if (existingDoc) {
      try {
        const parsed = JSON.parse(existingDoc);
        if (parsed?.preTextual?.autor && (parsed.preTextual.autor.includes('ROGERIO') || parsed.preTextual.autor.includes('ROGÉRIO'))) {
          parsed.preTextual.autor = '';
        }
        if (parsed?.chapters && Array.isArray(parsed.chapters)) {
          parsed.chapters = parsed.chapters
            .filter((c: any) => c.title?.trim().toUpperCase() !== 'REVISÃO DA LITERATURA')
            .map((c: any, idx: number) => ({ ...c, number: idx + 1 }));
        }
        setDoc(parsed);
      } catch (e) {
        setDoc(getEmptyTccDocument());
      }
    } else {
      // New user gets a clean empty form with instructions inside
      const newCleanDoc = getEmptyTccDocument();
      setDoc(newCleanDoc);
      localStorage.setItem(docKey, JSON.stringify(newCleanDoc));
    }
    setActiveTab('dashboard');
  };

  const handleOpenAiAssistant = (chapterId?: string, title?: string, text?: string) => {
    const targetChap = chapterId
      ? doc.chapters.find((c) => c.id === chapterId)
      : doc.chapters[0];

    setAiModal({
      isOpen: true,
      chapterId: targetChap?.id || doc.chapters[0]?.id || '',
      chapterTitle: title || `Capítulo ${targetChap?.number || 1}: ${targetChap?.title || ''}`,
      currentText: text || targetChap?.content || '',
    });
  };

  const handleInsertAiDraft = (targetChapterId: string, textToAppend: string) => {
    setDoc((prev) => {
      const updatedChapters = prev.chapters.map((c) => {
        if (c.id === targetChapterId) {
          const newContent = c.content
            ? `${c.content}\n\n${textToAppend}`
            : textToAppend;
          return { ...c, content: newContent };
        }
        return c;
      });
      return { ...prev, chapters: updatedChapters };
    });
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDirectDownloadDocx = async () => {
    try {
      const blob = await exportTccToDocx(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.preTextual.titulo || 'TCC_ABNT'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Erro ao exportar Word (.docx).');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        fontType={doc.fontType}
        onFontChange={handleFontChange}
        user={user}
        onOpenLogin={() => setActiveTab('login')}
        onLogout={handleLogout}
        onExportDocx={() => setIsExportOpen(true)}
        onExportPdf={handlePrintPdf}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user.isLoggedIn ? (
          <LoginPage
            user={user}
            onLogout={handleLogout}
            onLogin={handleLogin}
            onNavigateDashboard={() => setActiveTab('dashboard')}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                doc={doc}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenAiAssistant={handleOpenAiAssistant}
                onExportDocx={() => setIsExportOpen(true)}
                onExportPdf={handlePrintPdf}
              />
            )}

            {activeTab === 'pre-textual' && (
              <PreTextualEditor
                data={doc.preTextual}
                onChange={(newPre) => setDoc((prev) => ({ ...prev, preTextual: newPre }))}
              />
            )}

            {activeTab === 'chapters' && (
              <ChapterManager
                chapters={doc.chapters}
                onChange={(newChaps) => setDoc((prev) => ({ ...prev, chapters: newChaps }))}
                onOpenAiAssistant={(chapId, title, text) =>
                  handleOpenAiAssistant(chapId, title, text)
                }
              />
            )}

            {activeTab === 'references' && (
              <ReferenceManager
                references={doc.references}
                chapters={doc.chapters}
                onChange={(newRefs) => setDoc((prev) => ({ ...prev, references: newRefs }))}
              />
            )}

            {activeTab === 'preview' && (
              <AbntPreview doc={doc} onPrintPdf={handlePrintPdf} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs print:hidden">
        <p className="font-semibold text-slate-300">
          TCC Maker - FAATESP — Sistema de Formatação Acadêmica ABNT NBR 14724 & NBR 6023
        </p>
        <p className="text-slate-500 mt-1">
          Todos os direitos reservados • Rogério Augusto Fernandes
        </p>
      </footer>

      {/* Modals & Lateral Drawers */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        doc={doc}
        onPrintPdf={handlePrintPdf}
      />

      <AiAssistantModal
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal((prev) => ({ ...prev, isOpen: false }))}
        chapterId={aiModal.chapterId}
        chapterTitle={aiModal.chapterTitle}
        currentText={aiModal.currentText}
        topic={doc.preTextual.titulo}
        onInsertText={handleInsertAiDraft}
      />
    </div>
  );
}
