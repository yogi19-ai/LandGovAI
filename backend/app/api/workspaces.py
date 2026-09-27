import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Workspace, WorkspaceMember, WorkspaceTask, User, AuditLog
from app.schemas import WorkspaceCreate, WorkspaceResponse, TaskCreate, TaskResponse
from app.security import get_current_user

router = APIRouter(prefix="/workspaces", tags=["Collaborative Workspaces"])

@router.get("", response_model=List[WorkspaceResponse])
def list_workspaces(db: Session = Depends(get_db)):
    ws_list = db.query(Workspace).all()
    if not ws_list:
        # Seed default project workspace
        ws = Workspace(
            id="WS-2025-01",
            title="National Land Reform Policy Evaluation 2025-2030",
            description="Inter-institutional research workspace for evaluating agrarian land reform policies, SVAMITVA impact, and tenure security across rural India.",
            research_objective="Evaluate policy impacts on land disputes, titling efficiency, and smallholder credit access.",
            owner_email="researcher@mord.gov.in",
            status="Active"
        )
        db.add(ws)
        db.commit()

        # Seed default tasks
        t1 = WorkspaceTask(
            id="TSK-101",
            workspace_id="WS-2025-01",
            title="Compile State-wise SVAMITVA Drone Survey Progress",
            assigned_to="Dr. R. Sundaram",
            status="Completed",
            priority="High",
            due_date="2025-02-15"
        )
        t2 = WorkspaceTask(
            id="TSK-102",
            workspace_id="WS-2025-01",
            title="Run Policy Simulation on Tenancy Title Legalization",
            assigned_to="Priyanka Verma",
            status="In Progress",
            priority="High",
            due_date="2025-03-30"
        )
        db.add_all([t1, t2])
        db.commit()
        ws_list = db.query(Workspace).all()

    return ws_list

@router.post("", response_model=WorkspaceResponse)
def create_workspace(
    ws_in: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ws_id = f"WS-{uuid.uuid4().hex[:6].upper()}"
    ws = Workspace(
        id=ws_id,
        title=ws_in.title,
        description=ws_in.description,
        research_objective=ws_in.research_objective,
        owner_email=current_user.email,
        status="Active"
    )
    db.add(ws)
    db.commit()

    # Add owner as member
    member = WorkspaceMember(
        workspace_id=ws_id,
        user_email=current_user.email,
        user_name=current_user.full_name,
        role="Owner"
    )
    db.add(member)
    db.commit()
    db.refresh(ws)

    return ws

@router.post("/{ws_id}/tasks", response_model=TaskResponse)
def add_task(
    ws_id: str,
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ws = db.query(Workspace).filter(Workspace.id == ws_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")

    tsk_id = f"TSK-{uuid.uuid4().hex[:6].upper()}"
    task = WorkspaceTask(
        id=tsk_id,
        workspace_id=ws_id,
        title=task_in.title,
        assigned_to=task_in.assigned_to or current_user.full_name,
        status="To Do",
        priority=task_in.priority,
        due_date=task_in.due_date
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    return task
