from typing import Optional, List
from pydantic import BaseModel, EmailStr
import datetime

# Security & User Schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "PUBLIC_USER"
    organization: Optional[str] = None
    designation: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    organization: Optional[str]
    designation: Optional[str]
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Document Schemas
class DocumentCreate(BaseModel):
    title: str
    category: str
    author: str
    organization: str
    year: int
    topic: str
    region: str
    state_code: str
    document_type: str = "PDF"
    keywords: List[str]
    summary: str
    access_level: str = "PUBLIC"

class DocumentResponse(BaseModel):
    id: str
    title: str
    category: str
    author: str
    organization: str
    year: int
    topic: str
    region: str
    state_code: str
    document_type: str
    keywords: str
    summary: str
    citations: int
    download_url: str
    access_level: str
    file_size: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Workspace Schemas
class TaskCreate(BaseModel):
    title: str
    assigned_to: Optional[str] = None
    priority: str = "Medium"
    due_date: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    workspace_id: str
    title: str
    assigned_to: Optional[str]
    status: str
    priority: str
    due_date: Optional[str]
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class WorkspaceCreate(BaseModel):
    title: str
    description: str
    research_objective: str

class WorkspaceResponse(BaseModel):
    id: str
    title: str
    description: str
    research_objective: str
    owner_email: str
    status: str
    created_at: datetime.datetime
    tasks: List[TaskResponse] = []

    class Config:
        from_attributes = True

# Policy Simulation Schemas
class SimulationRunRequest(BaseModel):
    title: str
    state_code: str
    scenario_type: str # Land Reform, Urban Expansion, Climate Risk Adaptation, Cadastral Digitization
    target_year: int = 2030
    policy_intensity_pct: float = 25.0 # 0-100%
    budget_allocation_cr: float = 500.0 # Crores
    interventions: List[str] = []

class SimulationResponse(BaseModel):
    id: str
    title: str
    state_code: str
    scenario_type: str
    parameters: dict
    baseline_metrics: dict
    scenario_metrics: dict
    impact_summary: str
    disclaimer: str = "PROTOTYPE / SIMULATION RESULT: Not an official government prediction."
    created_at: datetime.datetime

# Innovation Portal Schemas
class ChallengeCreate(BaseModel):
    title: str
    category: str
    description: str
    prize_pool: str
    eligibility: str
    deadline: str

class SubmissionCreate(BaseModel):
    challenge_id: str
    team_name: str
    proposal_title: str
    abstract: str
    document_url: Optional[str] = None

# AI Assistant Schemas
class AISearchQuery(BaseModel):
    query: str
    category_filter: Optional[str] = None
    state_filter: Optional[str] = None
    year_filter: Optional[int] = None

class AISynthesisRequest(BaseModel):
    document_ids: List[str]
    synthesis_focus: str = "Policy Implications & Land Governance Strategy"

class AIPredictRequest(BaseModel):
    state_code: str
    target_year: int = 2030
    indicator: str = "land_disputes"
