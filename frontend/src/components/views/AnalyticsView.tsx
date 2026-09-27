import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  BrainCircuit, 
  FileSpreadsheet,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend 
} from 'recharts';

interface AnalyticsViewProps {
  onNavigate: (view: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onNavigate }) => {
  const [trends, setTrends] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any>({});
  const [decisionSupport, setDecisionSupport] = useState<any>({});
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedState, setSelectedState] = useState<string>('TN');

  useEffect(() => {
    loadAnalytics();
  }, [selectedState]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [tData, dData, decData, fData] = await Promise.all([
        api.getLandUseTrends(),
        api.getDisputesAnalytics(),
        api.getDecisionSupport(),
        api.aiPredict(selectedState, 2030)
      ]);
      setTrends(tData);
      setDisputes(dData);
      setDecisionSupport(decData);
      setForecast(fData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20 text-slate-400 text-sm">Loading statistical analytics engine...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-500/20">
              Requirement 11 & 3
            </span>
            <span className="text-xs text-slate-400 font-mono">Pandas / NumPy / Scikit-Learn Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            Advanced Analytics & Decision Support System
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Statistical regression models, land dispute forecasting, decadal land use transition analysis, and data-backed policy recommendations.
          </p>
        </div>

        <button 
          onClick={() => onNavigate('reports')}
          className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-colors flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export Policy Brief
        </button>
      </div>

      {/* Decision Support Summary Box */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40">
        <div className="flex items-center gap-2 text-sky-400">
          <BrainCircuit className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-100 heading-font">{decisionSupport.title}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Key Empirical Findings</h4>
            <ul className="text-xs space-y-1.5">
              {decisionSupport.key_findings?.map((kf: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0"></span>
                  <span>{kf}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recommended Action Matrix</h4>
            <ul className="text-xs space-y-1.5">
              {decisionSupport.recommended_policy_actions?.map((act: any, idx: number) => (
                <li key={idx} className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-200">{act.action}</span>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                    act.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {act.priority}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Forecast Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100 heading-font flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Scikit-Learn ML Land Dispute Forecast (2025–2030)
              </h3>
              <p className="text-xs text-slate-400">
                Linear regression prediction model for pending litigation cases
              </p>
            </div>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-900 text-xs font-semibold text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700"
            >
              <option value="TN">Tamil Nadu</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="MH">Maharashtra</option>
              <option value="KA">Karnataka</option>
            </select>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast?.forecast || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#F1F5F9' }} />
                <Line type="monotone" dataKey="projected_pending_disputes" name="Projected Disputes" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {forecast && (
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Annual Reduction Rate: <strong className="text-emerald-400">{forecast.annual_reduction_rate_pct}%</strong></span>
              <span className="text-slate-400">Model R² Score: <strong className="text-sky-400">{forecast.model_r2_score}</strong></span>
            </div>
          )}
        </div>

        {/* Dispute Causes Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 heading-font">
              Dispute Volume by Cause Category
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated from Revenue Court digests across surveyed states
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disputes.disputes_by_cause || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="Primary_Cause" stroke="#94A3B8" tick={{ fontSize: 9 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#F1F5F9' }} />
                <Bar dataKey="Pending_Cases_2025" name="Pending Cases" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Litigation Volume 2025: <strong className="text-amber-400">{disputes.total_disputes_2025?.toLocaleString()}</strong></span>
            <span>YoY Change: <strong className="text-emerald-400">{disputes.year_over_year_change_pct}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
