const BASE_URL = '/api/v1';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'API Request failed' }));
      throw new Error(err.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (data: any) => fetchApi<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => fetchApi<any>('/auth/me'),

  // Dashboard
  getNationalOverview: () => fetchApi<any>('/dashboard/national-overview'),

  // Repository
  getDocuments: (query?: string, category?: string, state_code?: string, year?: number) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'ALL') params.append('category', category);
    if (state_code && state_code !== 'ALL') params.append('state_code', state_code);
    if (year) params.append('year', year.toString());
    return fetchApi<any>(`/documents?${params.toString()}`);
  },
  uploadDocument: (doc: any) => fetchApi<any>('/documents/upload', { method: 'POST', body: JSON.stringify(doc) }),

  // AI & Search
  aiSearch: (query: string, category_filter?: string, state_filter?: string) => 
    fetchApi<any>('/ai/search', { method: 'POST', body: JSON.stringify({ query, category_filter, state_filter }) }),
  getRecommendations: (doc_id: string) =>
    fetchApi<any>(`/ai/recommendations/${doc_id}`),
  aiSynthesis: (document_ids: string[], synthesis_focus: string) =>
    fetchApi<any>('/ai/synthesis', { method: 'POST', body: JSON.stringify({ document_ids, synthesis_focus }) }),
  aiPredict: (state_code: string, target_year: number = 2030) =>
    fetchApi<any>('/ai/predict', { method: 'POST', body: JSON.stringify({ state_code, target_year }) }),
  aiAssistantChat: (prompt: string) =>
    fetchApi<any>(`/ai/assistant?prompt=${encodeURIComponent(prompt)}`),

  // GIS
  getStatesGeoJSON: () => fetchApi<any>('/gis/state-geojson'),
  getGISLayers: () => fetchApi<any>('/gis/layers'),

  // Analytics
  getLandUseTrends: () => fetchApi<any>('/analytics/land-use-trends'),
  getStateComparative: () => fetchApi<any>('/analytics/state-comparative'),
  getDisputesAnalytics: () => fetchApi<any>('/analytics/disputes'),
  getDecisionSupport: () => fetchApi<any>('/analytics/decision-support'),

  // Simulation
  getScenarios: () => fetchApi<any>('/simulation/scenarios'),
  runSimulation: (data: any) => fetchApi<any>('/simulation/run', { method: 'POST', body: JSON.stringify(data) }),

  // Workspaces
  getWorkspaces: () => fetchApi<any>('/workspaces'),
  createWorkspace: (data: any) => fetchApi<any>('/workspaces', { method: 'POST', body: JSON.stringify(data) }),
  addTask: (ws_id: string, task: any) => fetchApi<any>(`/workspaces/${ws_id}/tasks`, { method: 'POST', body: JSON.stringify(task) }),

  // Datasets
  getDatasetCatalogue: () => fetchApi<any>('/datasets/catalogue'),
  ingestDataset: (data: any) => fetchApi<any>('/datasets/ingest', { method: 'POST', body: JSON.stringify(data) }),

  // Innovation
  getChallenges: () => fetchApi<any>('/innovation/challenges'),
  submitIdea: (data: any) => fetchApi<any>('/innovation/submit', { method: 'POST', body: JSON.stringify(data) }),

  // Reports
  generateReport: (report_type: string, state_code: string = 'ALL') =>
    fetchApi<any>(`/reports/generate?report_type=${report_type}&state_code=${state_code}`),

  // Users & Audit Logs
  getAuditLogs: () => fetchApi<any>('/users/audit-logs'),
  getUsers: () => fetchApi<any>('/users')
};
