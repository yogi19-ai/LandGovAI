from fastapi import APIRouter
from app.gis.service import gis_service

router = APIRouter(prefix="/gis", tags=["Geospatial Engine"])

@router.get("/state-geojson")
def get_state_geojson():
    return gis_service.get_states_geojson()

@router.get("/layers")
def get_layers():
    return gis_service.get_gis_layers()
