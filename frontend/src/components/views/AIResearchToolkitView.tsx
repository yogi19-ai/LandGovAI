import React, { useState } from 'react';
import { api } from '../../services/api';
import { 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  Bot, 
  Send, 
  CheckCircle2, 
  FileText,
  Zap,
  HelpCircle
} from 'lucide-react';

export const AIResearchToolkitView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'predictive' | 'assistant'>('synthesis');

  // Synthesis State
  const [synthesisFocus, setSynthesisFocus] = useState<string>('Policy Implications of Cadastral Map Vectorization');
  const [synthesisResult, setSynthesisResult] = useState<any>(null);
  const [synthesisLoading, setSynthesisLoading] = useState<boolean>(false);

  // Assistant Chat State
  const [chatPrompt, setChatPrompt] = useState<string>('What policy interventions best address water body encroachments in Tamil Nadu?');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  const handleSynthesize = async () => {
    setSynthesisLoading(true);
    try {
      const res = await api.aiSynthesis(['DOC-2025-001', 'DOC-2024-014', 'DOC-2024-008'], synthesisFocus);
      setSynthesisResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSynthesisLoading(false);
    }
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatPrompt.trim()) return;
    setChatLoading(true);
    const userMsg = chatPrompt;
    setChatPrompt('');
    
    try {
      const res = await api.aiAssistantChat(userMsg);
      setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }, { sender: 'ai', data: res }]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Requirement 14
            </span>
            <span className="text-xs text-slate-400">AI-Assisted Research & Synthesis Suite</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            AI Research Toolkit
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Automated literature synthesis, trend detection, predictive modeling, and evidence-backed AI research assistant.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('synthesis')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'synthesis' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Literature Synthesis
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'assistant' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Assistant Chatbot
          </button>
        </div>
      </div>

      {/* Tab 1: Literature Synthesis */}
      {activeTab === 'synthesis' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100 heading-font flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-400" /> Automated Literature Synthesis & Theme Extractor
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Synthesis Policy Focus</label>
                <input
                  type="text"
                  value={synthesisFocus}
                  onChange={(e) => setSynthesisFocus(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-700"
                />
              </div>

              <button
                onClick={handleSynthesize}
                disabled={synthesisLoading}
                className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-colors flex items-center gap-2"
              >
                {synthesisLoading ? 'Synthesizing Documents...' : 'Generate Literature Synthesis'}
              </button>
            </div>
          </div>

          {synthesisResult && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-slate-100 heading-font">
                  Synthesized Evidence Report ({synthesisResult.document_count} Papers Analyzed)
                </h4>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  Confidence Score: {synthesisResult.confidence_score}%
                </span>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {synthesisResult.synthesis_summary}
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Policy Recommendations Derived</h5>
                <ul className="text-xs space-y-1.5">
                  {synthesisResult.policy_recommendations?.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-200 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-sky-500/10 border border-sky-500/30 text-sky-400 p-3 rounded-xl text-[11px] font-mono">
                {synthesisResult.disclaimer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: AI Assistant Chatbot */}
      {activeTab === 'assistant' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col h-[550px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-slate-100 heading-font">National Land Governance AI Assistant</h3>
            </div>
            <span className="text-xs text-slate-400">Grounded in Repository Data & Legal Acts</span>
          </div>

          {/* Chat Messages Window */}
          <div className="flex-1 overflow-y-auto space-y-4 p-2">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 space-y-2">
                <Bot className="w-8 h-8 text-sky-400 animate-bounce" />
                <p className="text-xs">Ask any question about Indian land governance, state records digitization, or litigation resolution.</p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'user' ? (
                    <div className="bg-sky-600 text-white p-3 rounded-2xl max-w-lg text-xs shadow-md">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="bg-slate-900/90 text-slate-200 p-4 rounded-2xl border border-slate-800 max-w-xl text-xs space-y-2">
                      <p className="leading-relaxed">{msg.data?.ai_response}</p>
                      {msg.data?.referenced_sources?.length > 0 && (
                        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
                          <strong className="text-slate-300">Sources Referenced:</strong>
                          {msg.data.referenced_sources.map((s: any) => (
                            <div key={s.id} className="text-sky-400">• {s.id}: {s.title}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask the AI Land Assistant..."
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              className="flex-1 bg-slate-900 text-slate-100 px-4 py-3 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="bg-sky-600 hover:bg-sky-500 text-white px-5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
