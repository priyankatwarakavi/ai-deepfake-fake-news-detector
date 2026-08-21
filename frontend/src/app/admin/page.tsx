'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Users, Activity, FileText, AlertTriangle, ShieldCheck, UserCheck, Trash2, Loader, Cpu, Film, Image } from 'lucide-react';
import { api, getCurrentUser } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // States
  const [adminStats, setAdminStats] = useState<any>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    setCurrentUser(user);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const stats = await api.analytics.admin();
      const users = await api.users.getAll();
      setAdminStats(stats);
      setUserList(users);
    } catch (e) {
      console.error("Failed to load administration dataset", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    setUpdatingUserId(userId);
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.users.updateRole(userId, newRole);
      // Reload lists
      loadData();
    } catch (err: any) {
      alert("Role update failed: " + err.message);
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      alert("Self-termination is not permitted.");
      return;
    }
    if (!confirm("Are you sure you want to permanently delete this user account?")) {
      return;
    }
    setUpdatingUserId(userId);
    try {
      await api.users.delete(userId);
      loadData();
    } catch (err: any) {
      alert("Deletion failed: " + err.message);
      setUpdatingUserId(null);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center">
          <ShieldAlert className="h-6.5 w-6.5 text-rose-500 mr-2" />
          Aegis.AI Admin Control Center
        </h2>
        <p className="text-xs text-slate-500 mt-1">Audit global verification traffic, manage sandbox user roles, and monitor system diagnostics.</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-slate-500" />
        </div>
      ) : (
        <>
          {/* Global Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Tenants</p>
              <p className="text-2xl font-extrabold text-white font-mono">{adminStats?.globalStats.totalUsers}</p>
            </div>
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Scans Run</p>
              <p className="text-2xl font-extrabold text-white font-mono">{adminStats?.globalStats.totalScans}</p>
            </div>
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reports Generated</p>
              <p className="text-2xl font-extrabold text-white font-mono">{adminStats?.globalStats.reportsCount}</p>
            </div>
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Global Disinfo Rate</p>
              <p className="text-2xl font-extrabold text-rose-500 font-mono">{adminStats?.globalStats.fakeRatio}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* User Management */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
                <Users className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tenant Directory</h3>
              </div>

              <div className="glass rounded-xl border border-slate-850 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-850 bg-slate-900/30 text-slate-400 font-mono">
                        <th className="p-3.5">Name</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {userList.map((usr) => (
                        <tr key={usr.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="p-3.5 font-semibold text-slate-200">{usr.name}</td>
                          <td className="p-3.5 text-slate-400 font-mono">{usr.email}</td>
                          <td className="p-3.5">
                            <span className={`inline-flex px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold border uppercase font-mono ${usr.role === 'admin' ? 'bg-rose-950/20 text-rose-400 border-rose-900/40' : 'bg-cyan-950/20 text-cyan-400 border-cyan-900/40'}`}>
                              {usr.role}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-2.5">
                            <button
                              onClick={() => handleRoleToggle(usr.id, usr.role)}
                              disabled={updatingUserId === usr.id}
                              className="text-slate-400 hover:text-cyan-400 transition-colors"
                              title="Toggle admin role"
                            >
                              <UserCheck className="h-4 w-4 inline" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(usr.id)}
                              disabled={updatingUserId === usr.id || usr.id === currentUser.id}
                              className="text-slate-500 hover:text-rose-500 disabled:opacity-30 transition-colors"
                              title="Delete user account"
                            >
                              <Trash2 className="h-4 w-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Media Distribution & System Logs */}
            <div className="space-y-6">
              
              {/* Media Breakdown */}
              <div className="glass p-5 rounded-2xl border border-slate-850 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                    <Cpu className="h-4 w-4 text-cyan-400 mr-2" />
                    CV Engine Ingestion
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Media types processed in Computer Vision pipelines.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-900 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500">Images</span>
                      <p className="text-lg font-mono font-bold text-white">{adminStats?.mediaBreakdown.images}</p>
                    </div>
                    <Image className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-900 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500">Videos</span>
                      <p className="text-lg font-mono font-bold text-white">{adminStats?.mediaBreakdown.videos}</p>
                    </div>
                    <Film className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Global Audit Logs */}
              <div className="glass p-5 rounded-2xl border border-slate-850 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                    <Activity className="h-4 w-4 text-cyan-400 mr-2" />
                    Global Audit Logs
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Live queue of scans passing security check.</p>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {adminStats?.systemLogs.map((log: any) => (
                    <div key={log.id} className="p-3 rounded-lg bg-slate-950/40 border border-slate-900 font-mono text-[10px] space-y-1">
                      <div className="flex justify-between items-center text-slate-500">
                        <span className="text-slate-300 font-bold truncate max-w-[100px]">{log.user}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-cyan-500 text-[11px]">{log.action}</p>
                      <p className="text-slate-400 text-[9px] truncate">{log.target}</p>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-900/60 mt-1">
                        <span className={log.result === 'Fake' ? 'text-rose-500' : 'text-green-500'}>
                          Result: {log.result}
                        </span>
                        <span className="text-[9px] text-slate-600">Conf: {log.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
}
