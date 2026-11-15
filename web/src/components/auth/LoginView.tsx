import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { useTranslation } from '../../i18n';
import { Building2, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import LanguageSelector from '../layout/LanguageSelector';
import { UserRole } from '../../context/RbacContext';

export const LoginView: React.FC = () => {
  const { t } = useTranslation();
  const { login, loginAsRole } = useAuth();

  const [email, setEmail] = useState('marketing@rmcc.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (!success) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleDemoClick = (role: UserRole, accountEmail: string) => {
    setEmail(accountEmail);
    setPassword('password123');
    loginAsRole(role);
  };

  return (
    <div className="min-h-screen bg-background text-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative ambient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Language Selector */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <LanguageSelector variant="dropdown" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg mb-4 ring-4 ring-primary/20">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-dark">
          {t('auth.brandTitle')}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {t('auth.brandSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-surface py-8 px-6 shadow-xl border border-border rounded-3xl sm:px-10 relative">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-dark">{t('auth.signInHeading')}</h3>
            <p className="text-xs text-muted mt-1">{t('auth.signInSubtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center space-x-2">
              <span className="font-semibold">{t('auth.invalidCredentials')}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-dark mb-1">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(false);
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-dark"
                  placeholder="name@restaurant.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark mb-1">
                {t('auth.passwordLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-dark"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-md shadow-primary/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{t('auth.signInButton')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Accounts Card Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-dark flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('auth.demoAccountsTitle')}</span>
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full">
                DEMO
              </span>
            </div>
            <p className="text-[11px] text-muted mb-3">
              {t('auth.demoAccountsSubtitle')}
            </p>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleDemoClick(acc.role, acc.email)}
                  className="w-full text-left p-2.5 rounded-xl bg-background hover:bg-primary/5 border border-border hover:border-primary/40 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      {acc.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-dark group-hover:text-primary transition-colors">
                        {acc.name}
                      </div>
                      <div className="text-[10px] text-muted">{acc.title}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface border border-border text-slate-600 dark:text-slate-300">
                    {acc.role.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
