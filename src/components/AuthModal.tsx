import React, { useState } from 'react';
import {
  Bird,
  Lock,
  Mail,
  User,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Languages,
} from 'lucide-react';
import { useAuth, ADMIN_EMAIL, ADMIN_PASSWORD } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { signIn, signUp, resetPassword } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await signIn(email, password);
        if (!res.success) {
          setError(
            res.error ||
              (language === 'sw'
                ? 'Kuingia kumeshindikana. Tafadhali hakikisha barua pepe na nywila ni sahihi.'
                : 'Failed to sign in. Please verify your email and password.')
          );
        }
      } else if (mode === 'signup') {
        if (password.length < 6) {
          setError(
            language === 'sw'
              ? 'Nywila lazima iwe na herufi zisizopungua 6.'
              : 'Password must be at least 6 characters long.'
          );
          setIsSubmitting(false);
          return;
        }

        const assignedRole: UserRole =
          email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

        const res = await signUp(email, password, fullName || 'Staff Member', assignedRole);
        if (!res.success) {
          setError(res.error || (language === 'sw' ? 'Usajili umeshindikana.' : 'Sign up failed.'));
        } else {
          setSuccess(
            language === 'sw'
              ? 'Akaunti imetengenezwa kikamilifu! Sasa unaweza kuingia.'
              : 'Account created successfully! You can now log in.'
          );
          setMode('login');
        }
      } else if (mode === 'reset') {
        const res = await resetPassword(email);
        if (!res.success) {
          setError(res.error || (language === 'sw' ? 'Ombi la nywila limeshindikana.' : 'Password reset request failed.'));
        } else {
          setSuccess(
            language === 'sw'
              ? 'Kiungo cha kubadili nywila kimetumwa kwenye barua pepe yako.'
              : 'Password reset link sent to your email.'
          );
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 text-slate-100 relative">
      {/* Top right language switch */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-slate-900/80 hover:bg-slate-800 text-emerald-300 font-bold text-xs shadow-lg transition-colors"
          title="Badili Lugha / Switch Language"
        >
          <Languages className="w-3.5 h-3.5" />
          <span>{language === 'en' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-slate-950 font-black shadow-xl shadow-emerald-500/20 mb-3 ring-4 ring-emerald-500/30">
          <Bird className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
          Kingdom Group
        </h1>
        <p className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest mt-1">
          {language === 'sw' ? 'Mfumo wa Usimamizi wa Kuku & Shamba' : 'Poultry Management System'}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Developed by <span className="text-emerald-300 font-semibold">CEO Junior Jackson Massawe</span>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white text-slate-900 py-8 px-6 sm:px-9 rounded-3xl shadow-2xl border border-slate-200/80 space-y-5">
          {/* Form Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {language === 'sw' ? 'Ingia (Login)' : 'Sign In'}
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition-colors ${
                mode === 'signup'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {language === 'sw' ? 'Fungua Akaunti (Register)' : 'Create Account'}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'sw' ? 'Jina Kamili la Mfanyakazi *' : 'Full Name / Operator Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder={language === 'sw' ? 'Mf. Baraka Jackson' : 'e.g. John Peter'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'sw' ? 'Barua Pepe (Email) *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="operator@kingdomgroup.co.tz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {language === 'sw' ? 'Nenosiri (Password) *' : 'Password *'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset');
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-[11px] text-emerald-700 hover:underline font-semibold"
                  >
                    {language === 'sw' ? 'Umesahau?' : 'Forgot?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <span>
                {isSubmitting
                  ? language === 'sw'
                    ? 'Inasindika...'
                    : 'Processing...'
                  : mode === 'login'
                  ? language === 'sw'
                    ? 'Ingia Kwenye Mfumo'
                    : 'Sign In to Farm System'
                  : language === 'sw'
                  ? 'Kamilisha Usajili'
                  : 'Complete Registration'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
