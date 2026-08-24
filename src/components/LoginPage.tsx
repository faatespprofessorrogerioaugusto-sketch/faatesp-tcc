import React, { useState } from 'react';
import { UserProfile } from '../types';
import { LogOut, CheckCircle, ShieldCheck, Sparkles, ArrowRight, Check } from 'lucide-react';

interface LoginPageProps {
  user: UserProfile;
  onLogout: () => void;
  onLogin: (account: { name: string; email: string; avatarUrl?: string }) => void;
  onNavigateDashboard: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  user,
  onLogout,
  onLogin,
  onNavigateDashboard,
}) => {
  const [customName, setCustomName] = useState(user.name || '');
  const [customEmail, setCustomEmail] = useState(user.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const nameToUse = customName.trim() || customEmail.split('@')[0];
    onLogin({
      name: nameToUse,
      email: customEmail.trim(),
    });
    setCustomName('');
    setCustomEmail('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fadeIn">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column - Product Branding & Benefits */}
        <div className="md:col-span-5 text-white space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Plataforma Acadêmica TCC Maker</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Sua Conta do Google para o TCC
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Conecte-se para sincronizar automaticamente a formatação do seu trabalho acadêmico, capítulos e citações.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3 text-xs text-slate-300">
              <div className="p-1 rounded-lg bg-blue-600/30 text-blue-400 shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <span>Sincronização em tempo real do progresso por usuário</span>
            </div>

            <div className="flex items-start space-x-3 text-xs text-slate-300">
              <div className="p-1 rounded-lg bg-blue-600/30 text-blue-400 shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <span>Formulários e dados limpos para cada nova conta conectada</span>
            </div>
          </div>
        </div>

        {/* Right Column - Dedicated Login Card */}
        <div className="md:col-span-7 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Header */}
          <div className="text-center space-y-2 border-b border-slate-100 pb-5">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Autenticação Google</h2>
            <p className="text-xs text-slate-500">
              Acesso seguro e personalizado ao TCC Maker
            </p>
          </div>

          {/* Logged In View */}
          {user.isLoggedIn ? (
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl shadow-sm shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <h4 className="text-base font-bold text-slate-900 truncate">{user.name || 'Usuário'}</h4>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sua conta está conectada e os dados estão salvos.</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onNavigateDashboard}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all text-xs shadow-md"
                >
                  <span>Acessar Painel do TCC</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-3 px-4 rounded-xl border border-red-200 transition-all text-xs shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair Totalmente da Conta Google</span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Ao deslogar, sua sessão é encerrada totalmente e os formulários ficam livres para nova conexão.
                </p>
              </div>
            </div>
          ) : (
            /* Logged Out View - Direct Google Login Form */
            <div className="space-y-5">
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Sessão Livre para Conectar</span>
                </div>
                <p className="text-amber-800 text-[11px]">
                  Informe seu nome e e-mail do Google para se conectar e iniciar ou continuar seu trabalho.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nome do Usuário / Acadêmico
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Neymar Júnior"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-700 font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      E-mail do Google (Gmail/Institucional) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: neymarjr@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-700 font-normal"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all text-xs shadow-md mt-2"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#ffffff"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#ffffff"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#ffffff"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#ffffff"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Conectar com uma conta Google</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

