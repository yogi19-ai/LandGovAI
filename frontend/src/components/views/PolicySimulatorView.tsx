import React, { useState } from 'react';
import { api } from '../../services/api';
import { SimulationResult } from '../../types';
import { 
  Sliders, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  ShieldAlert,
  Info,
  DollarSign,
  Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export const PolicySimulatorView: React.FC = () => {
  const [scenarioType, setScenarioType] = useState<string>('Cadastral Digitization');
  const [stateCode, setStateCode] = useState<string>('TN');
  const [policyIntensity, setPolicyIntensity] = useState<number>(50);
  const [budgetAllocation, setBudgetAllocation] = useState<number>(750);
  const [targetYear, setTargetYear] = useState<number>(2030);
  const [interventions, setInterventions] = useState<string[]>([
    'Drone-based 1:500 scale survey',
    'Sub-Registrar API synchronization',
    'AI mutation record audit'
  ]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const scenarios = [
    { id: 'Cadastral Digitization', name: 'Cadastral Vectorization Acceleration', cat: 'Tech & Admin' },
    { id: 'Climate Risk Adaptation', name: 'Climate Resilience & Coastal Zoning', cat: 'Environment' },
    { id: 'Urban Expansion & Land Pooling', name: 'Urban Sprawl Land Pooling', cat: 'Urban Development' },
    { id: 'Tenancy Reform', name: 'Tenancy Titling & Legalization', cat: 'Land Rights' },
  ];

  const availableInterventions = [
    'Drone-based 1:500 scale survey',
    'Sub-Registrar API synchronization',
    'AI mutation record audit',
    'Coastal buffer zone legal enforcement',
    'Revenue court fast-track tribunal',
    'SVAMITVA property card delivery'
  ];

  const toggleIntervention = (item: string) => {
    if (interventions.includes(item)) {
      setInterventions(interventions.filter(i => i !== item));
    } else {
      setInterventions([...interventions, item]);
    }
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.runSimulation({
        title: `${scenarioType} Simulation — ${stateCode}`,
        state_code: stateCode,
        scenario_type: scenarioType,
        target_year: targetYear,
        policy_intensity_pct: policyIntensity,
        budget_allocation_cr: budgetAllocation,
        interventions: interventions
      });
      setResult(res);
    } catch (err: any) {
      alert(err.message || 'Simulation execution failed');
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
              Requirement 12
            </span>
            <span className="text-xs text-slate-400 font-mono">Mathematical Policy Impact Modeling</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            Policy Simulation & Impact Lab
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Simulate ex-ante outcomes of proposed land governance policy interventions before legislative enactment. Compare baseline metrics against projected scenarios.
          </p>
        </div>

        {/* Prototype Warning Badge */}
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>PROTOTYPE SIMULATION MODE • Not official government predictions</span>
        </div>
      </div>

      {/* Main Configurator Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Parameter Controls */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 heading-font flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" /> Scenario Parameter Configurator
          </h3>

          {/* Scenario Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Policy Scenario</label>
            <select
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-700 font-semibold"
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.cat})</option>
              ))}
            </select>
          </div>

          {/* State Target */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Geographic State</label>
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-700"
            >
              <option value="TN">Tamil Nadu</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="MH">Maharashtra</option>
              <option value="KA">Karnataka</option>
              <option value="GJ">Gujarat</option>
            </select>
          </div>

          {/* Sliders */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1 font-semibold">
                <span>Policy Intensity Level</span>
                <span className="text-sky-400 font-mono">{policyIntensity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={policyIntensity}
                onChange={(e) => setPolicyIntensity(parseInt(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1 font-semibold">
                <span>Budget Allocation</span>
                <span className="text-emerald-400 font-mono">₹{budgetAllocation} Cr</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={budgetAllocation}
                onChange={(e) => setBudgetAllocation(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1 font-semibold">
                <span>Target Horizon Year</span>
                <span className="text-amber-400 font-mono">{targetYear}</span>
              </div>
              <input
                type="range"
                min="2026"
                max="2035"
                value={targetYear}
                onChange={(e) => setTargetYear(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Interventions Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Active Interventions</label>
            <div className="space-y-1.5 text-xs max-h-40 overflow-y-auto pr-1">
              {availableInterventions.map((item, idx) => (
                <label key={idx} className="flex items-center gap-2 text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800 cursor-pointer hover:bg-slate-800/60">
                  <input
                    type="checkbox"
                    checked={interventions.includes(item)}
                    onChange={() => toggleIntervention(item)}
                    className="rounded text-sky-600 bg-slate-900 border-slate-700"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Execute Policy Simulation
              </>
            )}
          </button>
        </div>

        {/* Right Simulation Results Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    SIMULATION ID: {result.id}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 heading-font mt-1">
                    {result.title}
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Target Year: <strong className="text-slate-200">{result.parameters.target_year}</strong></span>
              </div>

              {/* Baseline vs Proposed Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Pending Disputes</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-slate-400 line-through text-xs">{result.baseline_metrics.pending_disputes.toLocaleString()}</span>
                    <span className="text-lg font-bold text-emerald-400">{result.scenario_metrics.pending_disputes.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                    ↓ {result.scenario_metrics.dispute_reduction_pct}% Reduction
                  </span>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Cadastral Digitization</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-slate-400 line-through text-xs">{result.baseline_metrics.cadastral_digitization_pct}%</span>
                    <span className="text-lg font-bold text-sky-400">{result.scenario_metrics.cadastral_digitization_pct}%</span>
                  </div>
                  <span className="text-[10px] text-sky-400 font-semibold block mt-1">
                    ↑ Vectorization Complete
                  </span>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Court Resolution Speed</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-slate-400 line-through text-xs">{result.baseline_metrics.avg_resolution_time_months}m</span>
                    <span className="text-lg font-bold text-indigo-400">{result.scenario_metrics.avg_resolution_time_months}m</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-semibold block mt-1">
                    Faster Disputes Resolution
                  </span>
                </div>
              </div>

              {/* Impact Narrative */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Impact Executive Summary</h4>
                <p className="text-slate-300 leading-relaxed">
                  {result.impact_summary}
                </p>
              </div>

              {/* Assumptions & Limitations Note */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Model Assumptions</h4>
                  <ul className="space-y-1 text-slate-400">
                    {result.assumptions.map((asm, idx) => (
                      <li key={idx}>• {asm}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Limitations & Confidence</h4>
                  <p className="text-slate-400">{result.limitations}</p>
                </div>
              </div>

              {/* Disclaimer Bar */}
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3 rounded-xl text-xs font-semibold text-center font-mono">
                {result.disclaimer}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-16 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <Sliders className="w-10 h-10 text-sky-400 animate-pulse" />
              <h3 className="text-base font-bold text-slate-200">Configure & Run Policy Simulation</h3>
              <p className="text-xs max-w-md">
                Select scenario parameters, budget allocation, and active policy interventions on the left panel to generate ex-ante comparative impact projections.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
