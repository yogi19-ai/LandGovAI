from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import SimulationRunRequest, SimulationResponse
from app.simulation.simulator import policy_simulator
from app.models import AuditLog, User
from app.security import get_current_user

router = APIRouter(prefix="/simulation", tags=["Policy Simulation Lab"])

@router.get("/scenarios")
def list_scenarios():
    return [
        {
            "id": "SCEN-01",
            "name": "Cadastral Digitization & Vectorization Acceleration",
            "category": "Technology & Administrative Reform",
            "description": "Simulates complete vectorization of 1:500 scale cadastral maps combined with AI-assisted boundary dispute resolution.",
            "default_intensity_pct": 50.0,
            "default_budget_cr": 750.0
        },
        {
            "id": "SCEN-02",
            "name": "Climate Risk Adaptation & Coastal Buffer Zoning",
            "category": "Environmental Land Governance",
            "description": "Simulates legal enforcement of eco-sensitive buffer zones along coastline and flood plains to prevent high-vulnerability urban encroachment.",
            "default_intensity_pct": 40.0,
            "default_budget_cr": 1200.0
        },
        {
            "id": "SCEN-03",
            "name": "Urban Expansion & Town Planning Land Pooling",
            "category": "Urban-Rural Land Transition",
            "description": "Simulates Gujarat/Maharashtra town planning land pooling model for peri-urban infrastructure expansion.",
            "default_intensity_pct": 60.0,
            "default_budget_cr": 500.0
        },
        {
            "id": "SCEN-04",
            "name": "Tenancy Protection & Agrarian Title Guarantee",
            "category": "Land Rights & Social Equity",
            "description": "Simulates legal title registration and tenancy record mutation for smallholders and marginal farmers.",
            "default_intensity_pct": 75.0,
            "default_budget_cr": 900.0
        }
    ]

@router.post("/run", response_model=SimulationResponse)
def run_simulation(
    req: SimulationRunRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = policy_simulator.run_simulation(req)
    
    audit = AuditLog(
        user_email=current_user.email,
        action="POLICY_SIMULATION_RUN",
        resource_type="SIMULATION",
        details=f"Executed simulation '{req.title}' for state {req.state_code}"
    )
    db.add(audit)
    db.commit()

    return res
