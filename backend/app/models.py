import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="PUBLIC_USER") # ADMIN, RESEARCHER, POLICYMAKER, GOVERNMENT_OFFICIAL, INSTITUTION, EXPERT, PUBLIC_USER
    organization = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    category = Column(String, index=True) # Research Paper, Policy Paper, Dataset, Legal Document, Case Study, Government Report
    author = Column(String)
    organization = Column(String)
    year = Column(Integer, index=True)
    topic = Column(String, index=True)
    region = Column(String)
    state_code = Column(String, index=True)
    document_type = Column(String, default="PDF")
    keywords = Column(Text) # JSON string or comma-separated
    summary = Column(Text)
    citations = Column(Integer, default=0)
    download_url = Column(String)
    access_level = Column(String, default="PUBLIC") # PUBLIC, RESEARCHER, GOVERNMENT, RESTRICTED
    file_size = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    source = Column(String)
    description = Column(Text)
    file_format = Column(String) # CSV, GeoJSON, JSON, Satellite Imagery
    record_count = Column(Integer, default=0)
    size = Column(String)
    coverage = Column(String) # National, State-level, District-level
    date_range = Column(String)
    data_quality_score = Column(Float, default=95.0)
    access_level = Column(String, default="PUBLIC")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    research_objective = Column(Text)
    owner_email = Column(String, nullable=False)
    status = Column(String, default="Active") # Active, Archived, Completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tasks = relationship("WorkspaceTask", back_populates="workspace", cascade="all, delete-orphan")
    members = relationship("WorkspaceMember", back_populates="workspace", cascade="all, delete-orphan")

class WorkspaceMember(Base):
    __tablename__ = "workspace_members"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)
    user_email = Column(String, nullable=False)
    user_name = Column(String, nullable=False)
    role = Column(String, default="Member") # Owner, Lead Researcher, Collaborator, Reviewer
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)

    workspace = relationship("Workspace", back_populates="members")

class WorkspaceTask(Base):
    __tablename__ = "workspace_tasks"

    id = Column(String, primary_key=True, index=True)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)
    title = Column(String, nullable=False)
    assigned_to = Column(String)
    status = Column(String, default="To Do") # To Do, In Progress, Under Review, Completed
    priority = Column(String, default="Medium") # High, Medium, Low
    due_date = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    workspace = relationship("Workspace", back_populates="tasks")

class InnovationChallenge(Base):
    __tablename__ = "innovation_challenges"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String) # Hackathon, Research Grant, Pilot Project, Knowledge Competition
    description = Column(Text)
    prize_pool = Column(String)
    eligibility = Column(Text)
    deadline = Column(String)
    status = Column(String, default="Open") # Open, Reviewing, Closed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class InnovationSubmission(Base):
    __tablename__ = "innovation_submissions"

    id = Column(String, primary_key=True, index=True)
    challenge_id = Column(String, ForeignKey("innovation_challenges.id"), nullable=False)
    submitter_email = Column(String, nullable=False)
    team_name = Column(String, nullable=False)
    proposal_title = Column(String, nullable=False)
    abstract = Column(Text)
    document_url = Column(String)
    status = Column(String, default="Submitted") # Submitted, Under Evaluation, Shortlisted, Awarded
    score = Column(Float, nullable=True)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)

class PolicySimulationRecord(Base):
    __tablename__ = "policy_simulation_records"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    state_code = Column(String)
    scenario_type = Column(String) # Land Reform, Urban Expansion, Climate Risk Adaptation, Cadastral Digitization
    parameters_json = Column(Text)
    baseline_metrics_json = Column(Text)
    scenario_metrics_json = Column(Text)
    impact_summary = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=False)
    action = Column(String, nullable=False)
    resource_type = Column(String)
    details = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
