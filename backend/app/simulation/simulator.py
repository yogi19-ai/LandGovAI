import uuid
import datetime
from typing import Dict, Any, List
from app.schemas import SimulationRunRequest

class PolicySimulator:
    def run_simulation(self, req: SimulationRunRequest) -> Dict[str, Any]:
        sim_id = f"SIM-{uuid.uuid4().hex[:8].upper()}"
        intensity = max(5.0, min(100.0, req.policy_intensity_pct))
        budget = req.budget_allocation_cr
        
        # Baselines
        baseline_disputes = 45000
        baseline_digitization = 91.5
        baseline_forest_pct = 20.5
        baseline_resolution_months = 24.0
        
        # Calculate impact deltas based on scenario type
        if req.scenario_type == "Cadastral Digitization":
            dispute_reduction_pct = round(15.0 + (intensity * 0.35) + (budget / 100.0), 2)
            digitization_increase_pct = round(min(99.9 - baseline_digitization, (intensity * 0.12)), 2)
            resolution_speedup_months = round(baseline_resolution_months * (dispute_reduction_pct / 100.0), 1)
            
            projected_disputes = int(baseline_disputes * (1 - dispute_reduction_pct / 100.0))
            projected_digitization = round(baseline_digitization + digitization_increase_pct, 2)
            projected_resolution_months = round(baseline_resolution_months - resolution_speedup_months, 1)
            projected_forest_pct = baseline_forest_pct
            
            summary = (
                f"Accelerating Cadastral Map Digitization with {intensity}% policy intensity and ₹{budget} Cr allocation "
                f"is projected to reduce pending land disputes by {dispute_reduction_pct}% (from {baseline_disputes:,} to {projected_disputes:,}) "
                f"and cut average court resolution time from {baseline_resolution_months} months to {projected_resolution_months} months."
            )
            
        elif req.scenario_type == "Climate Risk Adaptation":
            dispute_reduction_pct = round(8.0 + (intensity * 0.15), 2)
            digitization_increase_pct = 2.5
            forest_growth_pct = round((intensity * 0.08) + (budget / 200.0), 2)
            
            projected_disputes = int(baseline_disputes * (1 - dispute_reduction_pct / 100.0))
            projected_digitization = round(baseline_digitization + digitization_increase_pct, 2)
            projected_resolution_months = round(baseline_resolution_months - 3.2, 1)
            projected_forest_pct = round(baseline_forest_pct + forest_growth_pct, 2)
            
            summary = (
                f"Implementing Climate Resilience Buffer Zones with ₹{budget} Cr investment "
                f"is projected to expand protected forest/eco-sensitive cover from {baseline_forest_pct}% to {projected_forest_pct}% "
                f"while shielding 1.2M hectares of agricultural land from flood/salinity degradation."
            )
            
        elif req.scenario_type == "Urban Expansion & Land Pooling":
            dispute_reduction_pct = round(12.0 + (intensity * 0.20), 2)
            digitization_increase_pct = round(intensity * 0.08, 2)
            
            projected_disputes = int(baseline_disputes * (1 - dispute_reduction_pct / 100.0))
            projected_digitization = round(baseline_digitization + digitization_increase_pct, 2)
            projected_resolution_months = round(baseline_resolution_months - 4.5, 1)
            projected_forest_pct = round(baseline_forest_pct - 0.3, 2)
            
            summary = (
                f"Adopting Town Planning Scheme (TPS) Land Pooling with {intensity}% implementation intensity "
                f"streamlines urban acquisition, preventing peri-urban encroachment and providing 85,000 serviced residential plots."
            )
            
        else: # Land Reform & Tenancy Protection
            dispute_reduction_pct = round(22.0 + (intensity * 0.25), 2)
            digitization_increase_pct = 4.0
            
            projected_disputes = int(baseline_disputes * (1 - dispute_reduction_pct / 100.0))
            projected_digitization = round(baseline_digitization + digitization_increase_pct, 2)
            projected_resolution_months = round(baseline_resolution_months - 7.0, 1)
            projected_forest_pct = baseline_forest_pct
            
            summary = (
                f"Comprehensive tenancy title legalization and revenue court digitalization is projected to resolve "
                f"{baseline_disputes - projected_disputes:,} tenancy disputes within 36 months."
            )

        baseline_metrics = {
            "pending_disputes": baseline_disputes,
            "cadastral_digitization_pct": baseline_digitization,
            "avg_resolution_time_months": baseline_resolution_months,
            "forest_cover_pct": baseline_forest_pct
        }

        scenario_metrics = {
            "pending_disputes": projected_disputes,
            "cadastral_digitization_pct": projected_digitization,
            "avg_resolution_time_months": projected_resolution_months,
            "forest_cover_pct": projected_forest_pct,
            "dispute_reduction_pct": dispute_reduction_pct
        }

        return {
            "id": sim_id,
            "title": req.title,
            "state_code": req.state_code,
            "scenario_type": req.scenario_type,
            "parameters": {
                "target_year": req.target_year,
                "policy_intensity_pct": intensity,
                "budget_allocation_cr": budget,
                "interventions": req.interventions
            },
            "baseline_metrics": baseline_metrics,
            "scenario_metrics": scenario_metrics,
            "impact_summary": summary,
            "assumptions": [
                "Assumes 90%+ compliance by district revenue authorities.",
                "Assumes uninterrupted DILRMP central funding release.",
                "Assumes full API integration between Land Records and Judicial Revenue Courts."
            ],
            "limitations": "Model outputs are indicative prototype simulations based on linear-elasticity response curves and empirical DILRMP data.",
            "disclaimer": "PROTOTYPE / SIMULATION RESULT: Not an official government prediction.",
            "created_at": datetime.datetime.utcnow().isoformat()
        }

policy_simulator = PolicySimulator()
