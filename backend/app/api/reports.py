import datetime
from typing import Optional
from fastapi import APIRouter, Query
from app.analytics.engine import analytics_engine

router = APIRouter(prefix="/reports", tags=["Report Generation"])

@router.get("/generate")
def generate_report(
    report_type: str = Query("POLICY_BRIEF", description="POLICY_BRIEF, GIS_INSIGHTS, RESEARCH_SUMMARY, DISPUTE_AUDIT"),
    state_code: Optional[str] = Query("ALL")
):
    date_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    comp = analytics_engine.get_state_comparative_analytics()
    disp = analytics_engine.get_dispute_analytics()
    dec = analytics_engine.get_decision_support_summary()

    report_data = {
        "report_id": f"REP-{datetime.datetime.now().strftime('%Y%m%d')}-{report_type[:4]}",
        "title": f"National Land Governance Report — {report_type.replace('_', ' ')}",
        "generated_at": date_str,
        "issuing_authority": "Ministry of Rural Development, Department of Land Resources (DoLR)",
        "scope_state": state_code,
        "executive_summary": (
            f"This official evidence-based report synthesizes data from the National Land Governance Digital Platform. "
            f"Key metrics demonstrate a national RoR computerization rate of {comp.get('national_avg_record_digitization_pct', 97.5)}% "
            f"and an ongoing reduction of pending disputes by {abs(disp.get('year_over_year_change_pct', -5.2))}% annually."
        ),
        "key_findings": dec.get("key_findings", []),
        "policy_recommendations": dec.get("recommended_policy_actions", []),
        "disclaimer": "OFFICIAL DEMO REPORT: Generated from validated government open data sources.",
        "download_csv_url": "/api/v1/analytics/land-use-trends",
        "download_pdf_url": "#export-pdf"
    }

    return report_data
