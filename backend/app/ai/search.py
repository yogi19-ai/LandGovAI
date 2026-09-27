import json
import os
import re
from typing import List, Dict, Any

class AISearchEngine:
    def __init__(self):
        self.catalog_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed", "research_policy_catalog.json")
        self.documents = self._load_documents()

    def _load_documents(self) -> List[Dict[str, Any]]:
        if os.path.exists(self.catalog_path):
            with open(self.catalog_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def search(self, query: str, category_filter: str = None, state_filter: str = None, year_filter: int = None) -> List[Dict[str, Any]]:
        query_words = set(re.findall(r'\w+', query.lower()))
        results = []

        for doc in self.documents:
            # Apply filters
            if category_filter and category_filter != "ALL" and doc.get("category") != category_filter:
                continue
            if state_filter and state_filter != "ALL" and doc.get("state_code") != state_filter and doc.get("state_code") != "ALL":
                continue
            if year_filter and doc.get("year") != year_filter:
                continue

            # Calculate relevance score based on keyword match, title match, and keywords list match
            doc_text = (doc["title"] + " " + doc["summary"] + " " + " ".join(doc["keywords"]) + " " + doc["topic"]).lower()
            doc_words = set(re.findall(r'\w+', doc_text))
            
            common_words = query_words.intersection(doc_words)
            if not common_words and query.strip():
                continue

            score = len(common_words) * 15.0
            if any(qw in doc["title"].lower() for qw in query_words):
                score += 35.0
            if state_filter and doc.get("state_code") == state_filter:
                score += 20.0

            result = doc.copy()
            result["relevance_score"] = round(min(score + 40.0, 99.5), 1)
            results.append(result)

        # Sort by relevance score descending
        results.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)
        return results

    def get_recommendations(self, document_id: str) -> List[Dict[str, Any]]:
        target_doc = next((d for d in self.documents if d["id"] == document_id), None)
        if not target_doc:
            return self.documents[:3]

        target_keywords = set(target_doc.get("keywords", []))
        recs = []
        for doc in self.documents:
            if doc["id"] == document_id:
                continue
            doc_keywords = set(doc.get("keywords", []))
            overlap = len(target_keywords.intersection(doc_keywords))
            recs.append((doc, overlap))

        recs.sort(key=lambda x: x[1], reverse=True)
        return [r[0] for r in recs[:3]]

ai_search_engine = AISearchEngine()
