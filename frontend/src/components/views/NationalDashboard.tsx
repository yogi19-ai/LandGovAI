import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  Building2, 
  MapPin, 
  FileCheck, 
  AlertTriangle, 
  TreePine, 
  TrendingDown, 
  ArrowUpRight, 
  Download,
  Filter,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';

interface NationalDashboardProps {
  onNavigate: (view: string) => void;
}

export const NationalDashboard: React.FC<NationalDashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedState, setSelectedState] = useState<string>('ALL');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.getNationalOverview();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-400">Loading National Land Governance Intelligence...</span>
        </div>
      </div>
    );
  }

  const kpis = data.kpi_metrics || {};
  const trends = data.land_use_trends || [];
  const disputeCauses = data.dispute_causes || [];
  const stateRankings = data.state_rankings || [];

  const pieColors = ['#0284C7', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Evidence-Based Governance
              </span>
              <span className="text-xs text-slate-400 font-mono">Updated Sep 2026</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 heading-font">
              National Land Governance Dashboard
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Centralized monitoring of DILRMP land record computerization, cadastral vectorization, land dispute reduction, and satellite-based land use trends across Indian states.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('simulation')}
              className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-sky-600/20 transition-all flex items-center gap-2"
            >
              Run Policy Simulation <ArrowUpRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('reports')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">RoR Computerization</span>
            <FileCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 heading-font">
            {kpis.national_ror_digitization_pct}%
          </div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
            <span>↑ +2.4% YoY</span>
            <span className="text-slate-400">• DILRMP Target Achieved</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Cadastral Vectorization</span>
            <MapPin className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 heading-font">
            {kpis.cadastral_map_digitization_pct}%
          </div>
          <div className="text-xs text-sky-400 mt-2 flex items-center gap-1 font-medium">
            <span>↑ +4.1% YoY</span>
            <span className="text-slate-400">• High-Res Surveyed</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pending Land Disputes</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 heading-font">
            {kpis.total_pending_disputes?.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{kpis.dispute_yoy_change_pct}% YoY Reduction</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">SVAMITVA Property Cards</span>
            <Building2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 heading-font">
            {(kpis.svamitva_cards_distributed / 1000000).toFixed(2)} M
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">
            Gram Panchayat Rural Inhabited Titles
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Land Use Transition Area Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 heading-font">
                Decadal Land Use / Land Cover Transition (ISRO Satellite Data)
              </h3>
              <p className="text-xs text-slate-400">
                Tracking Agricultural vs Built-up vs Forest Cover % (2015 – 2025)
              </p>
            </div>
            <button onClick={() => onNavigate('analytics')} className="text-xs text-sky-400 hover:text-sky-300 font-semibold">
              Full Analytics →
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAgri" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUrban" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="Year" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} domain={[0, 60]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#F1F5F9' }} />
                <Area type="monotone" dataKey="Agriculture_Area_Pct" name="Agriculture %" stroke="#0284C7" fillOpacity={1} fill="url(#colorAgri)" />
                <Area type="monotone" dataKey="Urban_Builtup_Pct" name="Urban Built-up %" stroke="#F59E0B" fillOpacity={1} fill="url(#colorUrban)" />
                <Area type="monotone" dataKey="Forest_Cover_Pct" name="Forest Cover %" stroke="#10B981" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dispute Cause Breakdown Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 heading-font">
                Pending Land Litigation Drivers
              </h3>
              <p className="text-xs text-slate-400">
                Primary causes of court backlog (2025)
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disputeCauses} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <YAxis dataKey="Primary_Cause" type="category" stroke="#94A3B8" width={110} tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#F1F5F9' }} />
                <Bar dataKey="Pending_Cases_2025" name="Pending Cases" fill="#38BDF8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* State Land Governance Ranking Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 heading-font">
              State-Wise Land Governance Metrics (DoLR DILRMP Data)
            </h3>
            <p className="text-xs text-slate-400">
              Comparative progress across land record digitization, dispute volume, and climate risk index
            </p>
          </div>
          <button onClick={() => onNavigate('gis')} className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1">
            Open Interactive GIS Map →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-900/60">
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Total Area (sq km)</th>
                <th className="py-3 px-4">RoR Digitization</th>
                <th className="py-3 px-4">Cadastral Vectorization</th>
                <th className="py-3 px-4">Pending Disputes</th>
                <th className="py-3 px-4">Climate Vulnerability</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stateRankings.map((st: any) => (
                <tr key={st.state_code} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-sky-500/10 text-sky-400 font-mono text-[10px] flex items-center justify-center border border-sky-500/20">
                      {st.state_code}
                    </span>
                    {st.state_name}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{st.total_area_sq_km.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${st.dilrmp_record_digitization_pct}%` }}></div>
                      </div>
                      <span className="font-semibold text-emerald-400">{st.dilrmp_record_digitization_pct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full" style={{ width: `${st.cadastral_map_digitization_pct}%` }}></div>
                      </div>
                      <span className="font-semibold text-sky-400">{st.cadastral_map_digitization_pct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-amber-400">{st.land_disputes_pending.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                      st.climate_vulnerability_index > 0.75 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      st.climate_vulnerability_index > 0.65 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {st.climate_vulnerability_index}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => onNavigate('simulation')}
                      className="text-sky-400 hover:text-sky-300 hover:underline font-semibold"
                    >
                      Simulate Policy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
