'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, KeyRound, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await api.auth.verifyEmail({ email, code });
      setSuccess(response.message || 'Email verified successfully!');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Incorrect code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl border border-slate-800 relative z-10 glow-cyan">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-full bg-cyan-950/40 text-cyan-400 border border-cyan-900 mb-2">
          <Shield className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Email Verification</h2>
        <p className="text-sm text-slate-500">Provide the 6-digit access code sent to your email</p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-rose-400 bg-rose-950/20 border border-rose-900/60 p-3.5 rounded-xl text-sm animate-pulse">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex flex-col space-y-2 text-green-400 bg-green-950/20 border border-green-900/60 p-4 rounded-xl text-sm">
          <div className="flex items-center space-x-2 font-bold">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>Verification Complete</span>
          </div>
          <p className="text-xs text-slate-400">{success}</p>
          <p className="text-xs font-mono text-cyan-400 mt-2">Loading authentication portal...</p>
        </div>
      )}

      {!success && (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email (readonly) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Verifying Email
              </label>
              <input
                type="email"
                readOnly
                value={email}
                className="w-full rounded-xl border border-slate-850 bg-slate-900/40 py-3 px-4 text-sm text-slate-400 cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Verification Code */}
            <div className="space-y-1.5">
              <label htmlFor="code" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                6-Digit Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="code"
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-center tracking-widest font-mono text-lg"
                />
              </div>
              <p className="text-[11px] text-cyan-500/70 font-mono mt-1 text-center">
                * Prototype Tip: Enter "123456" as the mock code.
              </p>
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
              'Verify Access'
            )}
          </button>

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
  );
}

export default function Verify() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-[80px]" />
      <Suspense fallback={<div>Loading verification...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
