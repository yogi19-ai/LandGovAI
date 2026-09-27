export type UserRole = 
  | 'ADMIN'
  | 'RESEARCHER'
  | 'POLICYMAKER'
  | 'GOVERNMENT_OFFICIAL'
  | 'INSTITUTION'
  | 'EXPERT'
  | 'PUBLIC_USER';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  organization?: string;
  designation?: string;
  is_active: boolean;
}

export interface Document {
  id: string;
  title: string;
  category: string;
  author: string;
  organization: string;
  year: number;
  topic: string;
  region: string;
  state_code: string;
  document_type: string;
  keywords: string;
  summary: string;
  citations: number;
  download_url: string;
  access_level: string;
  file_size: string;
  relevance_score?: number;
}

export interface StateMetrics {
  state_code: string;
  state_name: string;
  total_area_sq_km: number;
  agriculture_area_pct: number;
  forest_area_pct: number;
  urban_area_pct: number;
  barren_wasteland_pct: number;
  dilrmp_record_digitization_pct: number;
  cadastral_map_digitization_pct: number;
  land_disputes_pending: number;
  climate_vulnerability_index: number;
  svamitva_cards_issued: number;
  latitude: number;
  longitude: number;
  major_issues: string[];
}

export interface WorkspaceTask {
  id: string;
  workspace_id: string;
  title: string;
  assigned_to?: string;
  status: string;
  priority: string;
  due_date?: string;
}

export interface Workspace {
  id: string;
  title: string;
  description: string;
  research_objective: string;
  owner_email: string;
  status: string;
  tasks: WorkspaceTask[];
}

export interface SimulationResult {
  id: string;
  title: string;
  state_code: string;
  scenario_type: string;
  parameters: {
    target_year: number;
    policy_intensity_pct: number;
    budget_allocation_cr: number;
    interventions: string[];
  };
  baseline_metrics: {
    pending_disputes: number;
    cadastral_digitization_pct: number;
    avg_resolution_time_months: number;
    forest_cover_pct: number;
  };
  scenario_metrics: {
    pending_disputes: number;
    cadastral_digitization_pct: number;
    avg_resolution_time_months: number;
    forest_cover_pct: number;
    dispute_reduction_pct: number;
  };
  impact_summary: string;
  assumptions: string[];
  limitations: string;
  disclaimer: string;
}

export interface InnovationChallenge {
  id: string;
  title: string;
  category: string;
  description: string;
  prize_pool: string;
  eligibility: string;
  deadline: string;
  status: string;
}

export interface AuditLog {
  id: number;
  user_email: string;
  action: string;
  resource_type: string;
  details: string;
  timestamp: string;
}
