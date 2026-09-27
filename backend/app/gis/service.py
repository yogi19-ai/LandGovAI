import os
import json
from typing import Dict, Any, List

class GISService:
    def __init__(self):
        self.states_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed", "indian_states_land_governance.json")

    def get_states_geojson(self) -> Dict[str, Any]:
        if not os.path.exists(self.states_file):
            return {"type": "FeatureCollection", "features": []}

        with open(self.states_file, "r", encoding="utf-8") as f:
            states_data = json.load(f)

        features = []
        for state in states_data:
            lat = state["latitude"]
            lng = state["longitude"]
            
            # Approximate spatial polygon boundary around state centroid for Leaflet rendering
            delta = 0.8
            polygon = [
                [lng - delta, lat - delta],
                [lng + delta, lat - delta],
                [lng + delta, lat + delta],
                [lng - delta, lat + delta],
                [lng - delta, lat - delta]
            ]

            feature = {
                "type": "Feature",
                "id": state["state_code"],
                "properties": {
                    "state_code": state["state_code"],
                    "state_name": state["state_name"],
                    "total_area_sq_km": state["total_area_sq_km"],
                    "agriculture_area_pct": state["agriculture_area_pct"],
                    "forest_area_pct": state["forest_area_pct"],
                    "urban_area_pct": state["urban_area_pct"],
                    "barren_wasteland_pct": state["barren_wasteland_pct"],
                    "dilrmp_record_digitization_pct": state["dilrmp_record_digitization_pct"],
                    "cadastral_map_digitization_pct": state["cadastral_map_digitization_pct"],
                    "land_disputes_pending": state["land_disputes_pending"],
                    "climate_vulnerability_index": state["climate_vulnerability_index"],
                    "svamitva_cards_issued": state["svamitva_cards_issued"],
                    "major_issues": state["major_issues"]
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [polygon]
                }
            }
            features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": features
        }

    def get_gis_layers() -> List[Dict[str, Any]]:
        return [
            {"id": "land_use", "name": "Land Use / Land Cover (ISRO LULC)", "type": "Raster/Vector", "status": "Active"},
            {"id": "climate_vulnerability", "name": "Climate Vulnerability Index", "type": "Heatmap", "status": "Active"},
            {"id": "cadastral_digitization", "name": "DILRMP Cadastral Map Progress", "type": "Vector Choropleth", "status": "Active"},
            {"id": "dispute_hotspots", "name": "Land Litigation Hotspots", "type": "Point Density", "status": "Active"},
            {"id": "svamitva_coverage", "name": "SVAMITVA Property Mapping", "type": "Boundary Layer", "status": "Active"}
        ]

gis_service = GISService()
