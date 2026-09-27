import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Document, UserRole } from '../../types';
import { 
  BookOpen, 
  Search, 
  Upload, 
  Filter, 
  FileText, 
  Download, 
  Tag, 
  Building, 
  Calendar, 
  Lock, 
  Globe,
  PlusCircle,
  X,
  CheckCircle2
} from 'lucide-react';

interface DigitalRepositoryProps {
  currentRole: UserRole;
  onNavigate: (view: string) => void;
}

export const DigitalRepository: React.FC<DigitalRepositoryProps> = ({ currentRole, onNavigate }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'Research Paper',
    author: '',
    organization: '',
    year: 2025,
    topic: 'Land Records & Governance',
    region: 'National',
    state_code: 'ALL',
    keywords: 'Land Governance, Digital Records, Policy',
    summary: '',
    access_level: 'PUBLIC'
  });
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [categoryFilter, stateFilter]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docs = await api.getDocuments(searchQuery, categoryFilter, stateFilter);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const kw = uploadData.keywords.split(',').map(s => s.trim());
      await api.uploadDocument({
        ...uploadData,
        keywords: kw
      });
      setUploadSuccess('Document uploaded and metadata indexed successfully into the repository!');
      setTimeout(() => {
        setUploadSuccess(null);
        setShowUploadModal(false);
        fetchDocuments();
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to upload document');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Requirement 7
            </span>
            <span className="text-xs text-slate-400">Metadata-Indexed Governance Knowledge</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            Centralized Digital Repository
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Browse, search, preview, and download authoritative land governance research publications, policy briefs, legal statutes, case studies, and government reports.
          </p>
        </div>

        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-sky-600/20 transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Deposit Document
        </button>
      </div>

      {/* Search & Filters Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by keywords, title, author, state, or summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl text-xs border border-slate-700 focus:outline-none focus:border-sky-500"
            />
          </div>
          <button type="submit" className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors">
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Categories</option>
              <option value="Research Paper" className="bg-slate-900">Research Paper</option>
              <option value="Policy Paper" className="bg-slate-900">Policy Paper</option>
              <option value="Legal Document" className="bg-slate-900">Legal Document</option>
              <option value="Case Study" className="bg-slate-900">Case Study</option>
              <option value="Government Report" className="bg-slate-900">Government Report</option>
            </select>
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Region:</span>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">National / All States</option>
              <option value="TN" className="bg-slate-900">Tamil Nadu</option>
              <option value="UP" className="bg-slate-900">Uttar Pradesh</option>
              <option value="MH" className="bg-slate-900">Maharashtra</option>
              <option value="KA" className="bg-slate-900">Karnataka</option>
              <option value="GJ" className="bg-slate-900">Gujarat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="flex justify-center py-20 text-slate-400 text-sm">Loading repository records...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-sky-500/10 text-sky-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-sky-500/20">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {doc.state_code === 'ALL' ? 'NATIONAL' : doc.state_code}
                  </span>
                </div>

                <h3 
                  onClick={() => setSelectedDoc(doc)} 
                  className="font-bold text-slate-100 hover:text-sky-400 cursor-pointer text-sm line-clamp-2 leading-snug mb-2 transition-colors"
                >
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                  {doc.summary}
                </p>

                <div className="space-y-1.5 text-[11px] text-slate-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{doc.organization}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Year: {doc.year} • {doc.citations} Citations</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{doc.file_size} • {doc.document_type}</span>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedDoc(doc)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
                  >
                    Preview
                  </button>
                  <a 
                    href={doc.download_url} 
                    className="text-xs bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Get
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Detail Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-2xl w-full border border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-0.5 rounded border border-sky-500/20">
                  {selectedDoc.category}
                </span>
                <h3 className="text-lg font-bold text-slate-100 heading-font mt-2">
                  {selectedDoc.title}
                </h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div><strong className="text-slate-300">Author(s):</strong> {selectedDoc.author}</div>
              <div><strong className="text-slate-300">Organization:</strong> {selectedDoc.organization}</div>
              <div><strong className="text-slate-300">Publication Year:</strong> {selectedDoc.year}</div>
              <div><strong className="text-slate-300">Region Coverage:</strong> {selectedDoc.region} ({selectedDoc.state_code})</div>
              <div><strong className="text-slate-300">Keywords:</strong> {selectedDoc.keywords}</div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Abstract / Executive Summary</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                {selectedDoc.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">Access Tier: <strong className="text-emerald-400">{selectedDoc.access_level}</strong></span>
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedDoc(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700">
                  Close
                </button>
                <a href={selectedDoc.download_url} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5">
                  <Download className="w-4 h-4" /> Download Official Copy ({selectedDoc.file_size})
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-xl w-full border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 heading-font flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-400" /> Deposit Research / Policy Document
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Document Title *</label>
                <input
                  type="text"
                  required
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500"
                  placeholder="e.g., Evaluation of Cadastral Map Digitization in Tamil Nadu"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Category</label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                  >
                    <option value="Research Paper">Research Paper</option>
                    <option value="Policy Paper">Policy Paper</option>
                    <option value="Legal Document">Legal Document</option>
                    <option value="Case Study">Case Study</option>
                    <option value="Government Report">Government Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Publication Year</label>
                  <input
                    type="number"
                    value={uploadData.year}
                    onChange={(e) => setUploadData({ ...uploadData, year: parseInt(e.target.value) })}
                    className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Author(s) *</label>
                  <input
                    type="text"
                    required
                    value={uploadData.author}
                    onChange={(e) => setUploadData({ ...uploadData, author: e.target.value })}
                    className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                    placeholder="Dr. A. Sharma, Prof. R. Ananth"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Organization *</label>
                  <input
                    type="text"
                    required
                    value={uploadData.organization}
                    onChange={(e) => setUploadData({ ...uploadData, organization: e.target.value })}
                    className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                    placeholder="IIT Madras / NITI Aayog"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={uploadData.keywords}
                  onChange={(e) => setUploadData({ ...uploadData, keywords: e.target.value })}
                  className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Summary / Abstract *</label>
                <textarea
                  required
                  rows={3}
                  value={uploadData.summary}
                  onChange={(e) => setUploadData({ ...uploadData, summary: e.target.value })}
                  className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500"
                  placeholder="Provide concise abstract and findings..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl">
                  Upload & Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
