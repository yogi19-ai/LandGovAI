import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  Database, 
  Upload, 
  CheckCircle2, 
  FileCode, 
  Globe, 
  Layers, 
  ShieldCheck,
  RefreshCw,
  Plus
} from 'lucide-react';

export const DatasetCatalogue: React.FC = () => {
  const [catalogue, setCatalogue] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ingestTitle, setIngestTitle] = useState<string>('');
  const [ingestSource, setIngestSource] = useState<string>('State Revenue Department');
  const [ingestFormat, setIngestFormat] = useState<string>('CSV');
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  useEffect(() => {
    loadCatalogue();
  }, []);

  const loadCatalogue = async () => {
    setLoading(true);
    try {
      const data = await api.getDatasetCatalogue();
      setCatalogue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.ingestDataset({
        dataset_title: ingestTitle,
        file_format: ingestFormat,
        source: ingestSource
      });
      setIngestStatus(res.message);
      setIngestTitle('');
      setTimeout(() => setIngestStatus(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Ingestion failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Requirement 13
            </span>
            <span className="text-xs text-slate-400">Multi-Source Data Ingestion & Transformation</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            Multi-Source Dataset Catalogue & Ingestion Pipeline
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Unified data catalogue unifying ISRO satellite imagery, remote sensing, DILRMP land records, revenue court litigation databases, and socio-economic census data.
          </p>
        </div>
      </div>

      {/* Ingestion Wizard */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 heading-font flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-sky-400" /> Data Ingestion Pipeline Wizard
        </h3>

        {ingestStatus && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> {ingestStatus}
          </div>
        )}

        <form onSubmit={handleIngest} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Dataset Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. State Cadastral Survey 2026"
              value={ingestTitle}
              onChange={(e) => setIngestTitle(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Data Source</label>
            <input
              type="text"
              value={ingestSource}
              onChange={(e) => setIngestSource(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">File Format</label>
            <select
              value={ingestFormat}
              onChange={(e) => setIngestFormat(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
            >
              <option value="CSV">CSV Tabular</option>
              <option value="GeoJSON">GeoJSON Vector</option>
              <option value="JSON">JSON Document</option>
              <option value="Satellite GeoTIFF">Satellite GeoTIFF</option>
            </select>
          </div>

          <div className="flex items-end">
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5">
              <Plus className="w-4 h-4" /> Ingest Dataset
            </button>
          </div>
        </form>
      </div>

      {/* Catalogue Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-100 heading-font">
          Active Ingested Data Catalog
        </h3>

        {loading ? (
          <div className="text-center py-10 text-slate-400 text-xs">Loading data catalogue...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogue.map((ds) => (
              <div key={ds.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="bg-sky-500/10 text-sky-400 font-mono font-semibold px-2 py-0.5 rounded border border-sky-500/20">
                      {ds.id}
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-400 font-mono font-semibold px-2 py-0.5 rounded border border-emerald-500/20">
                      Quality: {ds.data_quality_score}%
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-100 text-sm mb-1">{ds.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-3">{ds.description}</p>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-300">
                    <div><strong>Source:</strong> {ds.source}</div>
                    <div><strong>Coverage:</strong> {ds.coverage} ({ds.date_range})</div>
                    <div><strong>Format:</strong> {ds.file_format} • {ds.size}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px]">Access: <strong className="text-emerald-400">{ds.access_level}</strong></span>
                  <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg border border-slate-700 transition-colors">
                    Explore Schema
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
