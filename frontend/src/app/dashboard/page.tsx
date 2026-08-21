'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Brain, Image, Upload, AlertTriangle, FileText, CheckCircle, Search, Sparkles, Sliders, ChevronRight, Activity, Loader, Download } from 'lucide-react';
import { api, getCurrentUser } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'news' | 'deepfake'>('news');
  
  // Dashboard Analytics
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Fake News States
  const [newsText, setNewsText] = useState('');
  const [newsUrl, setNewsUrl] = useState('');
  const [newsResult, setNewsResult] = useState<any>(null);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  // Deepfake States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dfResult, setDfResult] = useState<any>(null);
  const [loadingDf, setLoadingDf] = useState(false);
  const [dfError, setDfError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  // Report States
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await api.analytics.dashboard();
      setAnalytics(data);
    } catch (e) {
      console.error("Failed to load dashboard metrics", e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleNewsScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsError(null);
    setNewsResult(null);
    setLoadingNews(true);

    try {
      const result = await api.detector.news(newsText || null, newsUrl || null);
      setNewsResult(result);
      // Refresh statistics
      fetchAnalytics();
    } catch (err: any) {
      setNewsError(err.message || 'Analysis failed.');
    } finally {
      setLoadingNews(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setDfResult(null);
      setDfError(null);
    }
  };

  const handleDeepfakeScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setDfError(null);
    setDfResult(null);
    setLoadingDf(true);
    setScanProgress(10);

    // Simulate analysis progress bar
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 400);

    try {
      const result = await api.detector.deepfake(selectedFile);
      clearInterval(interval);
      setScanProgress(100);
      setTimeout(() => {
        setDfResult(result);
        setLoadingDf(false);
        fetchAnalytics();
      }, 500);
    } catch (err: any) {
      clearInterval(interval);
      setDfError(err.message || 'Media analysis failed.');
      setLoadingDf(false);
    }
  };

  const handleGenerateReport = async (analysisType: string, analysisId: string, filename: string) => {
    setGeneratingReportId(analysisId);
    try {
      const response = await api.reports.generate(analysisType, analysisId);
      // Trigger browser PDF download
      await api.reports.download(response.reportId, filename);
      fetchAnalytics();
    } catch (e: any) {
      alert("Failed to generate PDF: " + e.message);
    } finally {
      setGeneratingReportId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl border border-slate-800 bg-slate-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-500/5 blur-[50px]" />
        <div className="space-y-1 relative z-10">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Sparkles className="h-5 w-5 text-cyan-400 mr-2" />
            Security Node Active: {user.name}
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Integrity scanning sandbox ready. Access role: <span className="text-cyan-400 uppercase font-bold">{user.role}</span>
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Scans Run</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-extrabold text-white font-mono">
              {loadingAnalytics ? '...' : analytics?.stats.totalScans}
            </p>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fake News Verified</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-extrabold text-white font-mono">
              {loadingAnalytics ? '...' : analytics?.stats.newsScans}
            </p>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deepfakes Scanned</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-extrabold text-white font-mono">
              {loadingAnalytics ? '...' : analytics?.stats.deepfakeScans}
            </p>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disinformation Index</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-extrabold text-rose-500 font-mono">
              {loadingAnalytics ? '...' : `${analytics?.stats.fakeRatio}%`}
            </p>
          </div>
        </div>
      </div>

      {/* Main scanning section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Workspace */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-slate-850">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-semibold text-sm transition-all ${activeTab === 'news' ? 'border-cyan-500 text-cyan-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              <Brain className="h-4.5 w-4.5" />
              <span>Fake News Scanner</span>
            </button>
            <button
              onClick={() => setActiveTab('deepfake')}
              className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-semibold text-sm transition-all ${activeTab === 'deepfake' ? 'border-cyan-500 text-cyan-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              <Image className="h-4.5 w-4.5" />
              <span>Deepfake Scanner</span>
            </button>
          </div>

          {/* TAB 1: FAKE NEWS SCANNER */}
          {activeTab === 'news' && (
            <div className="glass p-6 rounded-2xl border border-slate-850 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">NLP Authenticity Workspace</h3>
                <p className="text-xs text-slate-500 mt-1">Paste copy or paste URL of the news article for linguistic heuristics check.</p>
              </div>

              {newsError && (
                <div className="flex items-center space-x-2 text-rose-400 bg-rose-950/20 border border-rose-900/60 p-3 rounded-lg text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{newsError}</span>
                </div>
              )}

              <form onSubmit={handleNewsScan} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">News URL (Optional)</label>
                  <input
                    type="url"
                    value={newsUrl}
                    onChange={(e) => setNewsUrl(e.target.value)}
                    placeholder="https://news-outlet.com/article-url"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-white placeholder-slate-700 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">News Copy / Text</label>
                  <textarea
                    rows={6}
                    value={newsText}
                    onChange={(e) => setNewsText(e.target.value)}
                    placeholder="Paste the news story headline and paragraph text here..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-3 px-4 text-xs text-white placeholder-slate-750 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loadingNews || (!newsText && !newsUrl)}
                    className="inline-flex items-center h-10 px-5 rounded-lg bg-cyan-500 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-50"
                  >
                    {loadingNews ? (
                      <>
                        <Loader className="h-4.5 w-4.5 animate-spin mr-2" />
                        <span>Analysing Semantics...</span>
                      </>
                    ) : (
                      'Perform NLP Diagnostics'
                    )}
                  </button>
                </div>
              </form>

              {/* News Result Panel */}
              {newsResult && (
                <div className={`p-6 rounded-xl border ${newsResult.result === 'Fake' ? 'bg-rose-950/10 border-rose-900/60' : 'bg-green-950/10 border-green-900/60'} space-y-4 animate-fade-in`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {newsResult.result === 'Fake' ? (
                        <AlertTriangle className="h-5 w-5 text-rose-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      <span className="text-sm font-bold uppercase tracking-wider text-white">
                        Classification: {newsResult.result}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 border rounded ${newsResult.result === 'Fake' ? 'text-rose-400 bg-rose-950/40 border-rose-800' : 'text-green-400 bg-green-950/40 border-green-800'}`}>
                      {newsResult.confidence}% confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono py-2 border-y border-slate-900">
                    <div className="space-y-1">
                      <span className="text-slate-500">Source Credibility</span>
                      <p className="text-white font-bold">{newsResult.sourceCredibility}%</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500">Sentiment Score</span>
                      <p className="text-white font-bold">{newsResult.sentiment} ({newsResult.sentimentScore})</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Model Explanation:</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{newsResult.explanation}</p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleGenerateReport('news', newsResult.id, `report-news-${newsResult.id.substring(0,8)}.pdf`)}
                      disabled={generatingReportId === newsResult.id}
                      className="inline-flex items-center h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-850 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-50"
                    >
                      {generatingReportId === newsResult.id ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          <span>Building PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2 text-cyan-400" />
                          <span>Download Verification PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DEEPFAKE SCANNER */}
          {activeTab === 'deepfake' && (
            <div className="glass p-6 rounded-2xl border border-slate-850 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Computer Vision Splice Workspace</h3>
                <p className="text-xs text-slate-500 mt-1">Upload images or MP4 videos to detect compression errors and neural blending maps.</p>
              </div>

              {dfError && (
                <div className="flex items-center space-x-2 text-rose-400 bg-rose-950/20 border border-rose-900/60 p-3 rounded-lg text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{dfError}</span>
                </div>
              )}

              <form onSubmit={handleDeepfakeScan} className="space-y-4">
                
                {/* File Dropzone */}
                <div className="relative border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-8 text-center bg-slate-950/20 group cursor-pointer transition-all">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="p-3 rounded-full bg-slate-900 text-slate-400 group-hover:text-cyan-400 border border-slate-850 transition-colors">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-300">
                        {selectedFile ? selectedFile.name : 'Click or Drag image/video file to scan'}
                      </p>
                      <p className="text-[10px] text-slate-500">Supported formats: JPEG, PNG, WEBP, MP4, MOV (max 50MB)</p>
                    </div>
                  </div>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between text-xs p-3 bg-slate-900/40 border border-slate-850 rounded-xl">
                    <span className="text-slate-400 truncate max-w-xs">{selectedFile.name}</span>
                    <span className="text-slate-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                )}

                {loadingDf && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 font-mono">
                      <span>Facial Landmarker Overlay mapping...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="h-1.5 rounded bg-slate-850 overflow-hidden">
                      <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loadingDf || !selectedFile}
                    className="inline-flex items-center h-10 px-5 rounded-lg bg-cyan-500 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-50"
                  >
                    {loadingDf ? (
                      <>
                        <Loader className="h-4.5 w-4.5 animate-spin mr-2" />
                        <span>Rendering Mesh Diagnostics...</span>
                      </>
                    ) : (
                      'Perform Computer Vision Audit'
                    )}
                  </button>
                </div>
              </form>

              {/* Deepfake Result Panel */}
              {dfResult && (
                <div className={`p-6 rounded-xl border ${dfResult.result === 'Fake' ? 'bg-rose-950/10 border-rose-900/60' : 'bg-green-950/10 border-green-900/60'} space-y-4 animate-fade-in`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {dfResult.result === 'Fake' ? (
                        <AlertTriangle className="h-5 w-5 text-rose-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      <span className="text-sm font-bold uppercase tracking-wider text-white">
                        Classification: {dfResult.result}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 border rounded ${dfResult.result === 'Fake' ? 'text-rose-400 bg-rose-950/40 border-rose-800' : 'text-green-400 bg-green-950/40 border-green-800'}`}>
                      {dfResult.confidence}% confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs font-mono py-2 border-y border-slate-900">
                    <div className="space-y-1">
                      <span className="text-slate-500">Faces Tracked</span>
                      <p className="text-white font-bold">{dfResult.facesDetected}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500">Codec / Wrapper</span>
                      <p className="text-white font-bold">{dfResult.metadata.codec}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500">Resolution</span>
                      <p className="text-white font-bold">{dfResult.metadata.dimensions}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Anomaly Logs:</span>
                    <ul className="space-y-1.5">
                      {dfResult.anomalies.map((anom: string, i: number) => (
                        <li key={i} className="flex items-start text-xs text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 mr-2 shrink-0" />
                          <span>{anom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {dfResult.frames && dfResult.frames.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Keyframe Manipulation Map (Top 3 Keyframes):</span>
                      <div className="grid grid-cols-3 gap-2">
                        {dfResult.frames.slice(0, 3).map((frm: any, idx: number) => (
                          <div key={idx} className="p-2.5 rounded bg-slate-950/40 border border-slate-850 font-mono text-[10px] space-y-1">
                            <div className="flex justify-between text-slate-500">
                              <span>FR {frm.frame}</span>
                              <span className={frm.anomalyDetected ? 'text-rose-500' : 'text-green-500'}>
                                {frm.score}%
                              </span>
                            </div>
                            <div className="h-1 rounded bg-slate-900 overflow-hidden">
                              <div className={`h-full ${frm.anomalyDetected ? 'bg-rose-500' : 'bg-green-500'}`} style={{ width: `${frm.score}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleGenerateReport('deepfake', dfResult.id, `report-deepfake-${dfResult.id.substring(0,8)}.pdf`)}
                      disabled={generatingReportId === dfResult.id}
                      className="inline-flex items-center h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-850 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-50"
                    >
                      {generatingReportId === dfResult.id ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          <span>Building PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2 text-cyan-400" />
                          <span>Download Verification PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Charts & Side Activity */}
        <div className="space-y-6">
          
          {/* Active Audit Chart */}
          <div className="glass p-5 rounded-2xl border border-slate-850 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Daily Diagnostics Load</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Analysis distribution over last 7 days.</p>
            </div>
            
            {loadingAnalytics ? (
              <div className="flex h-32 items-center justify-center">
                <Loader className="h-5 w-5 animate-spin text-slate-500" />
              </div>
            ) : (
              <div className="flex items-end justify-between h-32 pt-4 px-2 font-mono text-[9px] text-slate-500 border-b border-slate-850">
                {analytics?.chartData.map((item: any, idx: number) => {
                  const maxVal = Math.max(...analytics.chartData.map((d: any) => d.news + d.deepfake), 1);
                  const newsHeight = (item.news / maxVal) * 100;
                  const dfHeight = (item.deepfake / maxVal) * 100;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center space-y-2 w-full group">
                      <div className="w-4 flex flex-col justify-end space-y-0.5 h-20 relative">
                        <div className="bg-cyan-500 rounded-t-sm transition-all duration-500" style={{ height: `${newsHeight}%` }} title={`News scans: ${item.news}`} />
                        <div className="bg-blue-600 rounded-t-sm transition-all duration-500" style={{ height: `${dfHeight}%` }} title={`Deepfake scans: ${item.deepfake}`} />
                      </div>
                      <span>{item.day}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="flex justify-center space-x-6 text-[10px] text-slate-400">
              <div className="flex items-center space-x-1.5">
                <div className="h-2 w-2 rounded-full bg-cyan-500" />
                <span>Linguistic scans</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                <span>Media scans</span>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="glass p-5 rounded-2xl border border-slate-850 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Diagnostics Logs</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Recent authenticity scans run by this account.</p>
            </div>

            {loadingAnalytics ? (
              <div className="flex h-32 items-center justify-center">
                <Loader className="h-5 w-5 animate-spin text-slate-500" />
              </div>
            ) : analytics?.recentActivity.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-6">No diagnostics logs created yet.</p>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {analytics?.recentActivity.map((act: any) => (
                  <div key={act.id} className="p-3 rounded-lg bg-slate-950/40 border border-slate-900 text-xs space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-300">{act.type}</span>
                      <span className={`font-mono text-[10px] px-1.5 py-0.2 border rounded ${act.result === 'Fake' ? 'text-rose-400 border-rose-950 bg-rose-950/10' : 'text-green-400 border-green-950 bg-green-950/10'}`}>
                        {act.result}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] truncate">{act.detail}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-600 font-mono pt-1">
                      <span>Conf: {act.confidence}%</span>
                      <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
