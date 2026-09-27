import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-slate-800 py-4 px-6 text-xs text-slate-400 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-slate-200">National Digital Platform for Land Governance Research & Policy Innovation</span>
          <span className="mx-2">•</span>
          <span>SIH Problem Statement 26019</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> ISO 27001 & NIC Compliant
          </span>
          <a href="/docs" target="_blank" rel="noreferrer" className="hover:text-sky-400 flex items-center gap-1 transition-colors">
            OpenAPI Specs <ExternalLink className="w-3 h-3" />
          </a>
          <span>© 2026 Ministry of Rural Development</span>
        </div>
      </div>
    </footer>
  );
};
