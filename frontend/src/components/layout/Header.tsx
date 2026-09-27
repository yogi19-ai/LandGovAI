import React from 'react';
import { UserRole } from '../../types';
import { Shield, Sparkles, Building2, UserCheck, Search, Bell } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange, activeView, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-emerald-600 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <span className="font-bold text-amber-500 text-xl tracking-tighter">DoLR</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Government of India
              </span>
              <span className="text-xs text-slate-400 font-mono">PS 26019</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 heading-font leading-tight">
              National Land Governance Digital Platform
            </h1>
            <p className="text-xs text-slate-400">
              Department of Land Resources (DoLR) • Ministry of Rural Development
            </p>
          </div>
        </div>

        {/* Center Quick Search Trigger */}
        <div className="hidden lg:flex items-center">
          <button 
            onClick={() => onNavigate('search')}
            className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl border border-slate-700 text-sm transition-all shadow-inner w-72"
          >
            <Search className="w-4 h-4 text-sky-400" />
            <span>AI Natural Language Search...</span>
            <kbd className="ml-auto text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">⌘K</kbd>
          </button>
        </div>

        {/* Right Role Switcher & User Control */}
        <div className="flex items-center gap-4">
          {/* Active Role Selector */}
          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
            <Shield className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Role</span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="PUBLIC_USER" className="bg-slate-900 text-slate-200">Public User</option>
                <option value="RESEARCHER" className="bg-slate-900 text-slate-200">Researcher</option>
                <option value="POLICYMAKER" className="bg-slate-900 text-slate-200">Policymaker</option>
                <option value="GOVERNMENT_OFFICIAL" className="bg-slate-900 text-slate-200">Govt Official</option>
                <option value="INSTITUTION" className="bg-slate-900 text-slate-200">Institution Admin</option>
                <option value="EXPERT" className="bg-slate-900 text-slate-200">Domain Expert</option>
                <option value="ADMIN" className="bg-slate-900 text-slate-200">System Admin</option>
              </select>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('user-management')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 relative"
            title="Notifications & Audit Logs"
          >
            <Bell className="w-4 h-4 text-sky-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
