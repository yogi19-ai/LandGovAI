from fastapi import APIRouter
from app.analytics.engine import analytics_engine
from app.gis.service import gis_service

router = APIRouter(prefix="/dashboard", tags=["National Land Governance Dashboard"])

@router.get("/national-overview")
def get_national_overview():
    comp = analytics_engine.get_state_comparative_analytics()
    disp = analytics_engine.get_dispute_analytics()
    trends = analytics_engine.get_land_use_trends()

    latest_trend = trends[-1] if trends else {}

    return {
        "kpi_metrics": {
            "total_land_area_sq_km": 3287263,
            "national_ror_digitization_pct": 98.6,
            "cadastral_map_digitization_pct": 91.2,
            "svamitva_cards_distributed": 11445000,
            "total_pending_disputes": disp.get("total_disputes_2025", 280000),
            "dispute_yoy_change_pct": disp.get("year_over_year_change_pct", -5.2),
            "forest_cover_pct": latest_trend.get("Forest_Cover_Pct", 22.2),
            "urban_builtup_pct": latest_trend.get("Urban_Builtup_Pct", 11.7)
        },
        "land_use_trends": trends,
        "dispute_causes": disp.get("disputes_by_cause", []),
        "state_rankings": comp.get("state_metrics", [])
    }
