'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await api.auth.forgotPassword({ email });
      setSuccess(response.message);
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.auth.resetPassword({ token: resetToken!, new_password: newPassword });
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-[80px]" />
      
      <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl border border-slate-800 relative z-10 glow-cyan">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-cyan-950/40 text-cyan-400 border border-cyan-900 mb-2">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Reset Access Key</h2>
          <p className="text-sm text-slate-500">Restore access to your Aegis.AI account</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-rose-400 bg-rose-950/20 border border-rose-900/60 p-3.5 rounded-xl text-sm animate-pulse">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="flex flex-col space-y-4 text-center">
            <div className="inline-flex items-center justify-center space-x-2 text-green-400 bg-green-950/20 border border-green-900/60 p-4 rounded-xl text-sm font-bold">
              <CheckCircle className="h-5 w-5" />
              <span>Password Updated Successfully</span>
            </div>
            <Link 
              href="/login" 
              className="inline-flex h-11 items-center justify-center rounded-xl bg-cyan-500 font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              Sign In with New Password
            </Link>
          </div>
        )}

        {/* Phase 2: Enter new password if token is available */}
        {!resetSuccess && resetToken && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div className="p-3 bg-cyan-950/40 border border-cyan-850 rounded-xl text-xs text-cyan-400 font-mono">
                Active Reset Token: <span className="font-bold">{resetToken}</span>
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 px-4 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-cyan-500 py-3.5 font-bold text-slate-950 hover:bg-cyan-400 transition-all disabled:opacity-50"
            >
              {loading ? <Loader className="h-5 w-5 animate-spin" /> : 'Confirm New Password'}
            </button>
          </form>
        )}

        {/* Phase 1: Request reset token */}
        {!resetSuccess && !resetToken && (
          <form className="mt-8 space-y-6" onSubmit={handleRequestToken}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-cyan-500 py-3.5 font-bold text-slate-950 hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'Generate Reset Token'
              )}
            </button>

            {success && (
              <div className="p-3 bg-cyan-950/20 border border-cyan-850 rounded-xl text-xs text-slate-400">
                {success}
              </div>
            )}

            <p className="text-center text-sm text-slate-500 mt-4">
              <Link 
                href="/login" 
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Back to Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
