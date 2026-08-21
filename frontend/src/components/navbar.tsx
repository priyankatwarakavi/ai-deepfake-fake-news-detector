'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, User, LogOut, LayoutDashboard, History, Settings, ShieldAlert } from 'lucide-react';
import { getCurrentUser, api } from '@/lib/api';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Poll or set user on mount and route changes
    setUser(getCurrentUser());
  }, [pathname]);

  const handleLogout = async () => {
    await api.auth.logout();
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#090d16]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-cyan-400 group">
          <Shield className="h-7 w-7 transition-transform group-hover:rotate-12 duration-300" />
          <span className="font-sans font-bold text-xl tracking-tight text-white">
            AEGIS<span className="text-cyan-400">.AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:text-cyan-400 ${pathname === '/' ? 'text-cyan-400' : 'text-slate-300'}`}
          >
            Home
          </Link>
          
          {user && (
            <>
              <Link 
                href="/dashboard" 
                className={`flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-cyan-400 ${pathname.startsWith('/dashboard') && !pathname.includes('/history') ? 'text-cyan-400' : 'text-slate-300'}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/dashboard/history" 
                className={`flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-cyan-400 ${pathname.includes('/history') ? 'text-cyan-400' : 'text-slate-300'}`}
              >
                <History className="h-4 w-4" />
                <span>Scan History</span>
              </Link>
              {user.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className={`flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-cyan-400 ${pathname.startsWith('/admin') ? 'text-cyan-400' : 'text-slate-300'}`}
                >
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                  <span>Admin Portal</span>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Profile Greeting */}
              <div className="hidden sm:flex items-center space-x-2 text-slate-300 bg-slate-900/60 border border-slate-800 rounded-full px-3.5 py-1.5 text-sm font-medium">
                <User className="h-4 w-4 text-cyan-400" />
                <span>{user.name}</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {user.role}
                </span>
              </div>
              
              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-900 hover:text-rose-400 transition-all"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                href="/login" 
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="inline-flex h-9 items-center justify-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
