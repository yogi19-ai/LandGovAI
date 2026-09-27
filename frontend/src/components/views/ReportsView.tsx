import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck,
  Building
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [reportType, setReportType] = useState<string>('POLICY_BRIEF');
  const [stateCode, setStateCode] = useState<string>('ALL');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    generateReportData();
  }, [reportType, stateCode]);

  const generateReportData = async () => {
    setLoading(true);
    try {
      const data = await api.generateReport(reportType, stateCode);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-500/20">
              Requirement 5
            </span>
            <span className="text-xs text-slate-400">Official Evidence Report Generator</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            Customized Land Governance Report Generator
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Generate, view, and export evidence-based policy briefs, GIS insight summaries, research outputs, and litigation audits.
          </p>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Report Category</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="bg-slate-900 text-xs font-semibold text-slate-200 px-3 py-2 rounded-xl border border-slate-700"
            >
              <option value="POLICY_BRIEF">Policy Briefing Report</option>
              <option value="GIS_INSIGHTS">GIS Spatial & Land Use Report</option>
              <option value="RESEARCH_SUMMARY">Research Synthesis Digest</option>
              <option value="DISPUTE_AUDIT">Revenue Litigation Audit</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">State Target</label>
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="bg-slate-900 text-xs font-semibold text-slate-200 px-3 py-2 rounded-xl border border-slate-700"
            >
              <option value="ALL">National / All States</option>
              <option value="TN">Tamil Nadu</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="MH">Maharashtra</option>
              <option value="KA">Karnataka</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-sky-400" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      {loading || !report ? (
        <div className="text-center py-20 text-slate-400 text-xs">Generating report preview...</div>
      ) : (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6 max-w-4xl mx-auto bg-slate-950/90 text-slate-100">
          {/* Government Header Stamp */}
          <div className="border-b-2 border-amber-500/50 pb-4 text-center space-y-1">
            <div className="text-xs font-bold text-amber-500 uppercase tracking-widest">
              Government of India • Ministry of Rural Development
            </div>
            <h1 className="text-xl font-extrabold heading-font text-slate-100">
              Department of Land Resources (DoLR)
            </h1>
            <div className="text-xs text-slate-400 font-mono">
              Official Evidence-Based Governance Policy Report • Ref: {report.report_id}
            </div>
          </div>

          {/* Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs font-mono">
            <div><span className="text-slate-400">Date:</span> {report.generated_at}</div>
            <div><span className="text-slate-400">Scope:</span> {report.scope_state}</div>
            <div><span className="text-slate-400">Type:</span> {reportType}</div>
            <div><span className="text-slate-400">Status:</span> APPROVED</div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">1. Executive Summary</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              {report.executive_summary}
            </p>
          </div>

          {/* Key Findings */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">2. Empirical Findings & Analytics</h3>
            <div className="space-y-2 text-xs">
              {report.key_findings?.map((kf: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>{kf}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Recommendations */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">3. Actionable Policy Directives</h3>
            <div className="space-y-2 text-xs">
              {report.policy_recommendations?.map((act: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-200 font-medium">{act.action}</span>
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono text-[10px] font-bold border border-emerald-500/20">
                    PRIORITY: {act.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Seal */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Digitally Authenticated by DoLR Knowledge Engine
            </div>
            <div className="font-mono">{report.disclaimer}</div>
          </div>
        </div>
      )}
    </div>
  );
};
