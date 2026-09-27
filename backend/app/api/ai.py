from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.schemas import AISearchQuery, AISynthesisRequest, AIPredictRequest
from app.ai.search import ai_search_engine
from app.ai.toolkit import ai_research_toolkit

router = APIRouter(prefix="/ai", tags=["AI Research Toolkit & Search"])

@router.post("/search")
def ai_search(query_in: AISearchQuery):
    results = ai_search_engine.search(
        query=query_in.query,
        category_filter=query_in.category_filter,
        state_filter=query_in.state_filter,
        year_filter=query_in.year_filter
    )
    return {
        "query": query_in.query,
        "result_count": len(results),
        "results": results
    }

@router.get("/recommendations/{doc_id}")
def get_recommendations(doc_id: str):
    return ai_search_engine.get_recommendations(doc_id)

@router.post("/synthesis")
def synthesize_literature(req: AISynthesisRequest):
    return ai_research_toolkit.synthesize_literature(req.document_ids, req.synthesis_focus)

@router.post("/predict")
def predict_trend(req: AIPredictRequest):
    return ai_research_toolkit.predict_land_dispute_trend(req.state_code, req.target_year)

@router.get("/assistant")
def chat_assistant(prompt: str = Query(...)):
    return ai_research_toolkit.research_assistant_chat(prompt)
