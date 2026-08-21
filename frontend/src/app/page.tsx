import Link from 'next/link';
import { Shield, Brain, Image, Play, FileText, CheckCircle, ArrowRight, Activity, AlertTriangle } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      
      {/* Glow Effects in Background */}
      <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-cyan-900/10 blur-[150px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[150px]" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 lg:px-8 flex flex-col items-center text-center">
        
        {/* Shield status header badge */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/20 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-400 mb-8 glow-cyan">
          <Activity className="h-3.5 w-3.5 animate-pulse" />
          <span>Real-time Anti-Disinformation Shield Active</span>
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-none">
          Verify Truth in the <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent text-glow">
            Synthetic Media Age
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
          Instantly detect manipulated faces, synthesised speech, deepfake video structures, and coordinated fake news campaigns using unified NLP and Computer Vision diagnostics.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            href="/register" 
            className="inline-flex h-12 w-full sm:w-48 items-center justify-center rounded-xl bg-cyan-500 font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Deploy Shield Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link 
            href="/login" 
            className="inline-flex h-12 w-full sm:w-48 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/40 hover:bg-slate-900/40 font-semibold text-white transition-colors"
          >
            Access Platform
          </Link>
        </div>

        {/* Dashboard Teaser Mockup */}
        <div className="mt-20 w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-950/60 p-2.5 backdrop-blur-sm glow-cyan">
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-xs text-slate-600 font-mono ml-4">https://aegis.shield/live-diagnostics</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 border border-cyan-800 rounded">
                SECURE ACCESS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-850">
                  <div className="flex items-center space-x-2 text-rose-500 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Detection Flagged: Fake (96.4% confidence)</span>
                  </div>
                  <p className="text-sm font-mono text-slate-300">
                    "Breaking: Local election centers report database shutdown by cyber command. Officials confirmed all votes are compromised..."
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-850 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Source: domainchecker.net</span>
                    <span>NLP Analysis</span>
                  </div>
                  <div className="h-2 rounded bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-rose-500" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-slate-900/60 border border-slate-850 p-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Neural Engine Logs</h4>
                  <div className="text-[11px] font-mono text-slate-500 space-y-1">
                    <p className="text-cyan-400">[info] Loaded BERT Classifier...</p>
                    <p className="text-cyan-400">[info] Checked domain signature...</p>
                    <p className="text-amber-500">[warn] Shouting text heuristic hit</p>
                    <p className="text-rose-500">[alert] 96.4% Fake Probability</p>
                  </div>
                </div>
                <div className="text-right mt-4">
                  <span className="inline-flex text-xs font-bold text-rose-400 bg-rose-950/20 px-2 py-0.5 border border-rose-900 rounded">
                    DANGEROUS CONTENT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Models & Features */}
      <section className="border-t border-slate-900 bg-slate-950/40 py-24 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Dual-Engine AI Diagnostic Architecture
            </h2>
            <p className="mt-4 text-slate-400">
              Combines specialized Natural Language Processing with deep Computer Vision diagnostics to cover all vectors of synthetic alteration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* NLP Detector Card */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-6 hover:border-cyan-500/30 transition-all group">
              <div className="inline-flex p-3 rounded-xl bg-cyan-950/40 text-cyan-400 border border-cyan-800">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                NLP Fake News Identifier
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Scans text, documents, or live URLs. Evaluates clickbait densities, lexical complexity, sentiment deviations, and compares against registered low-credibility domain indexes.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-cyan-500 mr-2" /> Lexical shouting detection
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-cyan-500 mr-2" /> Domain signature cross-matching
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-cyan-500 mr-2" /> Sentiment bias reporting
                </li>
              </ul>
            </div>

            {/* Deepfake CV Card */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-6 hover:border-cyan-500/30 transition-all group">
              <div className="inline-flex p-3 rounded-xl bg-cyan-950/40 text-cyan-400 border border-cyan-800">
                <Image className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                Computer Vision Deepfake Scan
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ingests images and videos. Extracts facial features, checks temporal blinking patterns, monitors boundary blending values, and flags double compression quantization noise in real-time.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-cyan-500 mr-2" /> Frame-by-frame blending maps
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-cyan-500 mr-2" /> Facial symmetry analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-cyan-500 mr-2" /> Chroma channel compression audit
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-[#090d16]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl border border-slate-850 bg-slate-950/50 text-center glow-cyan">
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">98.7%</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mt-2">NLP Recall</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-850 bg-slate-950/50 text-center glow-cyan">
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">96.4%</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mt-2">CV F1-Score</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-850 bg-slate-950/50 text-center glow-cyan">
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">&lt; 2.5s</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mt-2">Scan Latency</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-850 bg-slate-950/50 text-center glow-cyan">
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">100%</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mt-2">Local Audit Trail</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Contact & CTA */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Shield Your Content Pipeline Today
        </h2>
        <p className="max-w-xl mx-auto text-slate-400">
          Sign up to run instant deepfake scans, extract detailed PDF verification reports, and track content metrics in your private workspace.
        </p>
        <Link 
          href="/register" 
          className="inline-flex h-12 items-center justify-center rounded-xl bg-cyan-500 px-8 font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          Initialize Sandbox Access
        </Link>
      </section>

    </div>
  );
}
