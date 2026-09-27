import React, { useState } from 'react';
import { api } from '../../services/api';
import { Document } from '../../types';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Download, 
  Lightbulb, 
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

interface AISearchViewProps {
  onNavigate: (view: string) => void;
}

export const AISearchView: React.FC<AISearchViewProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState<string>('Find research related to climate-resilient land use in Tamil Nadu');
  const [results, setResults] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const sampleQueries = [
    'Find research related to climate-resilient land use in Tamil Nadu',
    'How can blockchain and AI reduce land mutation disputes in Uttar Pradesh?',
    'What is the progress of DILRMP cadastral map digitization across Indian states?',
    'Evaluate urban sprawl and agricultural land conversion in Bengaluru Karnataka corridor'
  ];

  const handleSearch = async (searchPrompt: string) => {
    if (!searchPrompt.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.aiSearch(searchPrompt);
      setResults(res.results || []);
      if (res.results && res.results.length > 0) {
        const recs = await api.getRecommendations(res.results[0].id);
        setRecommendations(recs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" /> Requirement 8
            </span>
            <span className="text-xs text-slate-400 font-mono">AI Natural Language Semantic Search</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            AI-Powered Search & Discovery Engine
          </h2>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            Search naturally across thousands of land governance research papers, policy documents, legal acts, ISRO satellite datasets, and case studies using semantic vector matching.
          </p>
        </div>

        {/* Natural Language Input Box */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask naturally e.g. 'Find research related to climate-resilient land use in Tamil Nadu'..."
              className="w-full bg-slate-950/90 text-slate-100 placeholder-slate-500 pl-12 pr-32 py-4 rounded-2xl text-sm border border-slate-700 focus:outline-none focus:border-sky-500 shadow-2xl"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            />
            <Search className="w-5 h-5 text-sky-400 absolute left-4 top-4" />
            <button
              onClick={() => handleSearch(query)}
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white px-5 rounded-xl text-xs font-semibold transition-all shadow-md flex items-center gap-1.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Analyze & Search <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          {/* Sample Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-400">Suggested Queries:</span>
            {sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => { setQuery(sq); handleSearch(sq); }}
                className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/80 transition-colors text-left truncate max-w-xs"
              >
                "{sq}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 heading-font flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              Search Results ({results.length} Indexed Evidence Resources)
            </h3>
            <span className="text-xs text-slate-400">Ranked by Semantic Relevance Score</span>
          </div>

          {results.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-400 rounded-2xl border border-slate-800">
              No direct matches found. Try broadening your natural language keywords.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {results.map((doc) => (
                <div key={doc.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-sky-500/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-0.5 rounded border border-sky-500/20">
                        {doc.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {doc.state_code === 'ALL' ? 'National Scope' : `State: ${doc.state_code}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{doc.relevance_score || 94.5}% Match Score</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 hover:text-sky-400 cursor-pointer">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {doc.summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
                    <div>
                      <strong>Author:</strong> {doc.author} • <strong>Org:</strong> {doc.organization} ({doc.year})
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onNavigate('repository')} 
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                      >
                        View Metadata
                      </button>
                      <a 
                        href={doc.download_url} 
                        className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Recommended Related Studies */}
          {recommendations.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 mt-6">
              <h4 className="text-sm font-bold text-slate-200 heading-font flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                AI Recommended Contextual Reading
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] text-sky-400 font-semibold uppercase">{rec.category}</span>
                    <h5 className="text-xs font-bold text-slate-200 line-clamp-2">{rec.title}</h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{rec.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
