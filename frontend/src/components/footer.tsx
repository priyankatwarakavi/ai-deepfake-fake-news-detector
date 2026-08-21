import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#070b12] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Shield className="h-6 w-6" />
              <span className="font-sans font-bold text-lg text-white">
                AEGIS<span className="text-cyan-400">.AI</span>
              </span>
            </div>
            <p className="text-sm max-w-sm text-slate-500">
              Aegis.AI uses high-performance deep neural network heuristics to verify content authenticity, combat disinformation campaigns, and diagnose deepfake media alterations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Core Technology</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">NLP News Verification</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Media Splice Analysis</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Quantization Diagnostics</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Enterprise Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">API Diagnostics Access</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">Automated Content Audits</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">Corporate Security Center</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Aegis.AI Technologies Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Security Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
