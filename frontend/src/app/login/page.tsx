'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, KeyRound, Mail, AlertCircle, Loader } from 'lucide-react';
import { api, setAuthToken, setCurrentUser } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.auth.login({ email, password });
      
      // Save credentials locally
      setAuthToken(response.access_token);
      setCurrentUser(response.user);
      
      // Route user to main workspace
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Incorrect credentials.');
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
          <h2 className="text-2xl font-bold tracking-tight text-white">Access Aegis.AI Shield</h2>
          <p className="text-sm text-slate-500">Sign in to initialize secure scanning tools</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-rose-400 bg-rose-950/20 border border-rose-900/60 p-3.5 rounded-xl text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Email Address
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

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Access Key
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot Key?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
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
              'Initialize Session'
            )}
          </button>

          <p className="text-center text-sm text-slate-500 mt-4">
            New user?{' '}
            <Link 
              href="/register" 
              className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Request Sandbox Access
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
