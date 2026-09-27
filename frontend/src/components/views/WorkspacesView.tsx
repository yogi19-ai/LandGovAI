import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Workspace, UserRole } from '../../types';
import { 
  Users, 
  Plus, 
  CheckSquare, 
  Clock, 
  UserPlus, 
  FileText, 
  Calendar, 
  X,
  CheckCircle2
} from 'lucide-react';

interface WorkspacesViewProps {
  currentRole: UserRole;
  onNavigate: (view: string) => void;
}

export const WorkspacesView: React.FC<WorkspacesViewProps> = ({ currentRole, onNavigate }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWs, setSelectedWs] = useState<Workspace | null>(null);

  // New Workspace Modal
  const [showCreateWs, setShowCreateWs] = useState<boolean>(false);
  const [wsTitle, setWsTitle] = useState<string>('');
  const [wsDesc, setWsDesc] = useState<string>('');
  const [wsObj, setWsObj] = useState<string>('');

  // New Task State
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskAssigned, setTaskAssigned] = useState<string>('Dr. R. Sundaram');

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      const list = await api.getWorkspaces();
      setWorkspaces(list);
      if (list.length > 0) setSelectedWs(list[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWs = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createWorkspace({
        title: wsTitle,
        description: wsDesc,
        research_objective: wsObj
      });
      setShowCreateWs(false);
      setWsTitle('');
      setWsDesc('');
      setWsObj('');
      loadWorkspaces();
    } catch (err: any) {
      alert(err.message || 'Failed to create workspace');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWs || !taskTitle.trim()) return;
    try {
      await api.addTask(selectedWs.id, {
        title: taskTitle,
        assigned_to: taskAssigned,
        priority: 'High',
        due_date: '2025-04-15'
      });
      setTaskTitle('');
      loadWorkspaces();
    } catch (err: any) {
      alert(err.message || 'Failed to add task');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-500/20">
              Requirement 9
            </span>
            <span className="text-xs text-slate-400">Inter-Institutional Research Collaboration</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            Collaborative Research Workspaces
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Create multi-disciplinary project workspaces connecting researchers, policymakers, academic institutions, and government officials for evidence-based land governance.
          </p>
        </div>

        <button 
          onClick={() => setShowCreateWs(true)}
          className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Research Project
        </button>
      </div>

      {/* Main Workspaces Layout */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs">Loading research workspaces...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workspace List Panel */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider px-2">Active Research Projects</h3>
            <div className="space-y-2">
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => setSelectedWs(ws)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedWs?.id === ws.id
                      ? 'bg-slate-800 border-sky-500/50 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    {ws.id}
                  </span>
                  <h4 className="font-bold text-slate-100 text-xs mt-1 leading-snug">{ws.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{ws.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Workspace Task Board & Detail Panel */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            {selectedWs ? (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    STATUS: {selectedWs.status}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 heading-font mt-2">{selectedWs.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{selectedWs.description}</p>
                  
                  <div className="mt-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <strong className="text-slate-200">Core Objective:</strong> {selectedWs.research_objective}
                  </div>
                </div>

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Add milestone research task..."
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="flex-1 bg-slate-900 text-slate-100 px-3 py-2 rounded-xl text-xs border border-slate-700"
                  />
                  <select
                    value={taskAssigned}
                    onChange={(e) => setTaskAssigned(e.target.value)}
                    className="bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700"
                  >
                    <option value="Dr. R. Sundaram">Dr. R. Sundaram</option>
                    <option value="Priyanka Verma">Priyanka Verma</option>
                    <option value="K. V. Ramanathan">K. V. Ramanathan</option>
                  </select>
                  <button type="submit" className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-semibold">
                    Add Task
                  </button>
                </form>

                {/* Task List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Project Milestones & Task Progress</h4>
                  {selectedWs.tasks?.length === 0 ? (
                    <div className="text-xs text-slate-400 py-4 text-center">No tasks assigned yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {selectedWs.tasks?.map((tsk) => (
                        <div key={tsk.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <CheckSquare className="w-4 h-4 text-sky-400" />
                            <div>
                              <span className="font-semibold text-slate-200">{tsk.title}</span>
                              <div className="text-[10px] text-slate-400">Assigned: {tsk.assigned_to} • Due: {tsk.due_date}</div>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            tsk.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {tsk.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 text-xs">Select a workspace project to view tasks.</div>
            )}
          </div>
        </div>
      )}

      {/* Create Workspace Modal */}
      {showCreateWs && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 heading-font">Create New Research Workspace</h3>
              <button onClick={() => setShowCreateWs(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWs} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Project Title *</label>
                <input
                  type="text"
                  required
                  value={wsTitle}
                  onChange={(e) => setWsTitle(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                  placeholder="e.g., Evaluation of Coastal Zone Land Rights"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Project Description</label>
                <textarea
                  rows={2}
                  value={wsDesc}
                  onChange={(e) => setWsDesc(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                  placeholder="Overview of research initiative..."
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Research Core Objective *</label>
                <textarea
                  required
                  rows={2}
                  value={wsObj}
                  onChange={(e) => setWsObj(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                  placeholder="Measurable policy objective..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowCreateWs(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-xl">
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
