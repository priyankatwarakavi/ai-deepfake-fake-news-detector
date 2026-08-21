'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Download, Loader, Calendar, ShieldAlert, FileSignature } from 'lucide-react';
import { api, getCurrentUser } from '@/lib/api';

export default function History() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await api.reports.getAll();
      setReports(data);
    } catch (e) {
      console.error("Failed to load reports", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId: string, filename: string) => {
    setDownloadingId(reportId);
    try {
      await api.reports.download(reportId, filename);
    } catch (e: any) {
      alert("Download failed: " + e.message);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FileSignature className="h-6 w-6 text-cyan-400 mr-2" />
          Authenticity Verification Certificates
        </h2>
        <p className="text-xs text-slate-500 mt-1">Review, audit, and download generated PDF reports for content integrity scans.</p>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader className="h-6 w-6 animate-spin text-slate-500" />
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-850 bg-slate-950/20 space-y-3">
          <div className="inline-flex p-3 rounded-full bg-slate-900 border border-slate-850 text-slate-500">
            <FileText className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-300">No reports generated yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Run an integrity check from the main dashboard and click "Download Verification PDF" to generate certificate reports.
            </p>
          </div>
        </div>
      ) : (
        <div className="glass rounded-xl border border-slate-850 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-900/30 text-slate-400 font-mono">
                  <th className="p-4 uppercase tracking-wider">Report Certificate ID</th>
                  {user.role === 'admin' && <th className="p-4 uppercase tracking-wider">Owner</th>}
                  <th className="p-4 uppercase tracking-wider">Engine Type</th>
                  <th className="p-4 uppercase tracking-wider">Generated Date</th>
                  <th className="p-4 text-right uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 font-sans">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-4 font-mono text-cyan-400">
                      #{rep.id.substring(0, 8)}...{rep.id.substring(rep.id.length - 4)}
                    </td>
                    {user.role === 'admin' && (
                      <td className="p-4 font-medium text-slate-300">
                        {rep.userName}
                      </td>
                    )}
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-900 border border-slate-850 text-slate-400">
                        {rep.analysisType === 'news' ? 'NLP News Engine' : 'CV Deepfake Engine'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono">
                      {new Date(rep.createdAt).toLocaleDateString()} {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDownload(rep.id, rep.pdfFilename)}
                        disabled={downloadingId === rep.id}
                        className="inline-flex items-center h-8 px-3 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-900 hover:bg-cyan-900/40 text-[11px] font-bold transition-all disabled:opacity-50"
                      >
                        {downloadingId === rep.id ? (
                          <Loader className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5 mr-1" />
                            <span>Download PDF</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
