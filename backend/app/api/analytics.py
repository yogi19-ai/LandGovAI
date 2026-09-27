from fastapi import APIRouter
from app.analytics.engine import analytics_engine

router = APIRouter(prefix="/analytics", tags=["Advanced Analytics & Decision Support"])

@router.get("/land-use-trends")
def get_land_use_trends():
    return analytics_engine.get_land_use_trends()

@router.get("/state-comparative")
def get_state_comparative():
    return analytics_engine.get_state_comparative_analytics()

@router.get("/disputes")
def get_disputes_analytics():
    return analytics_engine.get_dispute_analytics()

@router.get("/decision-support")
def get_decision_support():
    return analytics_engine.get_decision_support_summary()
