import React from 'react';
import { UserRole } from '../../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Search, 
  Map, 
  BarChart3, 
  Sliders, 
  Database, 
  Sparkles, 
  Users, 
  Trophy, 
  FileSpreadsheet, 
  ShieldCheck, 
  Code
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, currentRole }) => {
  const navItems = [
    { id: 'dashboard', label: 'National Dashboard', icon: LayoutDashboard, badge: 'Req 16' },
    { id: 'repository', label: 'Digital Repository', icon: BookOpen, badge: 'Req 7' },
    { id: 'search', label: 'AI Search & Recommend', icon: Search, badge: 'Req 8' },
    { id: 'gis', label: 'Interactive GIS Explorer', icon: Map, badge: 'Req 10' },
    { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3, badge: 'Req 11' },
    { id: 'simulation', label: 'Policy Simulation Lab', icon: Sliders, badge: 'Req 12' },
    { id: 'datasets', label: 'Dataset Catalogue', icon: Database, badge: 'Req 13' },
    { id: 'ai-toolkit', label: 'AI Research Toolkit', icon: Sparkles, badge: 'Req 14' },
    { id: 'workspaces', label: 'Research Workspaces', icon: Users, badge: 'Req 9' },
    { id: 'innovation', label: 'Innovation Hub', icon: Trophy, badge: 'Req 15' },
    { id: 'reports', label: 'Report Generator', icon: FileSpreadsheet, badge: 'Req 5' },
    { id: 'user-management', label: 'Access Control (RBAC)', icon: ShieldCheck, badge: 'Req 17' },
    { id: 'api-docs', label: 'REST API & Integration', icon: Code, badge: 'Req 18' },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col h-[calc(100vh-65px)] sticky top-[65px]">
      <div className="p-4 flex-1 overflow-y-auto space-y-1">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
          Platform Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md shadow-sky-600/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-400 group-hover:text-sky-300'}`} />
                <span>{item.label}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                isActive ? 'bg-sky-800/60 text-sky-100' : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
              }`}>
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer Role Badge */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>Environment: <strong className="text-slate-200">NIC Cloud Readiness</strong></span>
        </div>
      </div>
    </aside>
  );
};
