import React, { useState } from 'react';
import { api } from '../../services/api';
import { 
  Code, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  Server, 
  Globe, 
  FileCode,
  Sparkles
} from 'lucide-react';

export const APIIntegrationView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/dashboard/national-overview');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const endpoints = [
    { path: '/api/v1/dashboard/national-overview', method: 'GET', desc: 'National Overview KPI metrics & state rankings' },
    { path: '/api/v1/documents', method: 'GET', desc: 'Search digital repository documents' },
    { path: '/api/v1/gis/state-geojson', method: 'GET', desc: 'GeoJSON spatial polygons for GIS Explorer' },
    { path: '/api/v1/analytics/disputes', method: 'GET', desc: 'Revenue court dispute volume & causes' },
    { path: '/api/v1/simulation/scenarios', method: 'GET', desc: 'Policy simulation scenarios' },
    { path: '/api/v1/datasets/catalogue', method: 'GET', desc: 'Multi-source dataset catalogue' },
    { path: '/api/v1/workspaces', method: 'GET', desc: 'Research project workspaces' },
    { path: '/api/v1/innovation/challenges', method: 'GET', desc: 'Hackathons & research grants' },
    { path: '/api/v1/reports/generate?report_type=POLICY_BRIEF', method: 'GET', desc: 'Generated official policy brief' },
  ];

  const handleTestEndpoint = async () => {
    setLoading(true);
    try {
      const res = await fetch(selectedEndpoint);
      const data = await res.json();
      setTestResponse(data);
    } catch (err: any) {
      setTestResponse({ error: err.message || 'Request failed' });
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
              Requirement 18
            </span>
            <span className="text-xs text-slate-400 font-mono">FastAPI REST Architecture & OpenAPI Documentation</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            REST API & Seamless System Integration Engine
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Standardized JSON REST API architecture allowing external integration with state portals (e.g. Kaveri, Bhoomi), ISRO Bhuvan, and High Court revenue tribunals.
          </p>
        </div>

        <a 
          href="http://127.0.0.1:8000/docs" 
          target="_blank" 
          rel="noreferrer"
          className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" /> Open Swagger API UI
        </a>
      </div>

      {/* Interactive Endpoint Tester Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoint Selector Panel */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-2">Available REST Endpoints</h3>
          <div className="space-y-2">
            {endpoints.map((ep) => (
              <div
                key={ep.path}
                onClick={() => setSelectedEndpoint(ep.path)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedEndpoint === ep.path
                    ? 'bg-slate-800 border-sky-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {ep.method}
                  </span>
                  <span className="text-[11px] font-mono text-slate-200 truncate">{ep.path}</span>
                </div>
                <p className="text-[10px] text-slate-400">{ep.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Test Runner & Response Viewer */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                LIVE API TESTER
              </span>
              <h3 className="text-base font-bold text-slate-100 font-mono mt-1">{selectedEndpoint}</h3>
            </div>
            <button
              onClick={handleTestEndpoint}
              disabled={loading}
              className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5"
            >
              {loading ? 'Executing API Request...' : <><Play className="w-3.5 h-3.5 fill-white" /> Execute Request</>}
            </button>
          </div>

          {/* Response Box */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">JSON Response Payload</h4>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 max-h-96 overflow-y-auto leading-relaxed">
              {testResponse ? JSON.stringify(testResponse, null, 2) : '// Click "Execute Request" to test live API response payload'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
