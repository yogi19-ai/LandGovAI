import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { UserRole, AuditLog } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  Key, 
  Activity, 
  UserCheck, 
  Building2,
  Clock
} from 'lucide-react';

interface UserManagementViewProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({ currentRole, onRoleChange }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const logs = await api.getAuditLogs().catch(() => []);
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleUsers = [
    { email: 'admin@mord.gov.in', name: 'Director General (Admin)', role: 'ADMIN', org: 'Ministry of Rural Development' },
    { email: 'researcher@iitm.ac.in', name: 'Dr. R. Sundaram', role: 'RESEARCHER', org: 'IIT Madras Policy Cell' },
    { email: 'policymaker@niti.gov.in', name: 'Priyanka Verma', role: 'POLICYMAKER', org: 'NITI Aayog Land Desk' },
    { email: 'official@dolr.gov.in', name: 'K. V. Ramanathan', role: 'GOVERNMENT_OFFICIAL', org: 'Department of Land Resources' },
    { email: 'inst@iisc.ac.in', name: 'IISc Geospatial Lab', role: 'INSTITUTION', org: 'IISc Bangalore' },
    { email: 'expert@gisland.org', name: 'Dr. Amitabh Sharma', role: 'EXPERT', org: 'GIS Advisory Board' },
    { email: 'public@citizen.in', name: 'Public User', role: 'PUBLIC_USER', org: 'Public' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Requirement 17
            </span>
            <span className="text-xs text-slate-400 font-mono">Role-Based Access Control (RBAC) & Audit Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            Secure Access Control & Audit Management
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Granular permission governance across 7 system roles: ADMIN, RESEARCHER, POLICYMAKER, GOVERNMENT_OFFICIAL, INSTITUTION, EXPERT, and PUBLIC_USER.
          </p>
        </div>
      </div>

      {/* Role Switcher Demo Box */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 bg-slate-950/80">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" /> Interactive Role Switching Sandbox
        </h3>
        <p className="text-xs text-slate-400">
          Switch active user context to observe RBAC UI permissions and backend route protections.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
          {sampleUsers.map((u) => (
            <button
              key={u.role}
              onClick={() => onRoleChange(u.role as UserRole)}
              className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                currentRole === u.role
                  ? 'bg-sky-600/20 border-sky-500 text-sky-200 shadow-md ring-1 ring-sky-500'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <span className="font-bold text-[10px] text-sky-400 font-mono block">{u.role}</span>
              <span className="font-semibold text-slate-200 truncate mt-1">{u.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 heading-font flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Platform Security Audit Log Trail
          </h3>
          <span className="text-xs text-slate-400 font-mono">ISO 27001 System Audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-900/60">
                <th className="py-3 px-4">User Email</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Audit Details</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Audit logs populated upon live user actions (login, document upload, simulation execution, dataset ingestion).
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-200 font-semibold">{log.user_email}</td>
                    <td className="py-3 px-4">
                      <span className="bg-sky-500/10 text-sky-400 font-mono font-bold px-2 py-0.5 rounded border border-sky-500/20 text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{log.resource_type}</td>
                    <td className="py-3 px-4 text-slate-400">{log.details}</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono text-[10px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
