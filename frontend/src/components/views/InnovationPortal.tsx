import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { InnovationChallenge, UserRole } from '../../types';
import { 
  Trophy, 
  Lightbulb, 
  Calendar, 
  Award, 
  Send, 
  CheckCircle2, 
  X,
  FileText
} from 'lucide-react';

interface InnovationPortalProps {
  currentRole: UserRole;
  onNavigate: (view: string) => void;
}

export const InnovationPortal: React.FC<InnovationPortalProps> = ({ currentRole, onNavigate }) => {
  const [challenges, setChallenges] = useState<InnovationChallenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChallenge, setSelectedChallenge] = useState<InnovationChallenge | null>(null);

  // Proposal Submission State
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>('');
  const [proposalTitle, setProposalTitle] = useState<string>('');
  const [abstractText, setAbstractText] = useState<string>('');
  const [subMessage, setSubMessage] = useState<string | null>(null);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const data = await api.getChallenges();
      setChallenges(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;
    try {
      const res = await api.submitIdea({
        challenge_id: selectedChallenge.id,
        team_name: teamName,
        proposal_title: proposalTitle,
        abstract: abstractText,
        document_url: '/api/v1/documents/sample-proposal.pdf'
      });
      setSubMessage(res.message);
      setTimeout(() => {
        setSubMessage(null);
        setShowSubmitModal(false);
        setTeamName('');
        setProposalTitle('');
        setAbstractText('');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Requirement 15 & 6
            </span>
            <span className="text-xs text-slate-400">National Innovation & Hackathon Portal</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            National Innovation Portal & Hackathon Hub
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Fostering innovation challenges, MoRD research grants, pilot project competitions, and technology adoption for modernizing land governance across India.
          </p>
        </div>
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs">Loading innovation challenges...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((c) => (
            <div key={c.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-2.5 py-0.5 rounded border border-amber-500/20">
                    {c.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    Prize Pool: {c.prize_pool}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 heading-font">{c.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-300">
                  <div><strong>Eligibility:</strong> {c.eligibility}</div>
                  <div><strong>Deadline:</strong> {c.deadline}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Status: <strong className="text-emerald-400">{c.status}</strong></span>
                <button
                  onClick={() => { setSelectedChallenge(c); setShowSubmitModal(true); }}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Proposal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {showSubmitModal && selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-sky-400 uppercase">{selectedChallenge.category}</span>
                <h3 className="text-base font-bold text-slate-100 heading-font">{selectedChallenge.title}</h3>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {subMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> {subMessage}
              </div>
            )}

            <form onSubmit={handleSubmitProposal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Team Name / Institution *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                  placeholder="e.g. IIT Madras Land Innovation Lab"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Proposal Title *</label>
                <input
                  type="text"
                  required
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                  placeholder="e.g. AI-Based Cadastral Map Vectorization & Dispute Warning System"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Proposal Executive Abstract *</label>
                <textarea
                  required
                  rows={4}
                  value={abstractText}
                  onChange={(e) => setAbstractText(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                  placeholder="Summarize key innovation, methodology, and expected land governance impact..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowSubmitModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl">
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
