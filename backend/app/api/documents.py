import uuid
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Document, AuditLog, User
from app.schemas import DocumentCreate, DocumentResponse
from app.security import get_current_user
from app.ai.search import ai_search_engine

router = APIRouter(prefix="/documents", tags=["Digital Repository"])

@router.get("", response_model=List[DocumentResponse])
def search_documents(
    query: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    state_code: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    docs = db.query(Document).all()
    if not docs:
        # Load seed documents if db is empty
        for item in ai_search_engine.documents:
            doc = Document(
                id=item["id"],
                title=item["title"],
                category=item["category"],
                author=item["author"],
                organization=item["organization"],
                year=item["year"],
                topic=item["topic"],
                region=item["region"],
                state_code=item["state_code"],
                document_type=item["document_type"],
                keywords=",".join(item["keywords"]),
                summary=item["summary"],
                citations=item["citations"],
                download_url=item["download_url"],
                access_level=item["access_level"],
                file_size=item["file_size"]
            )
            db.add(doc)
        db.commit()
        docs = db.query(Document).all()

    # Filter in-memory/DB
    filtered = docs
    if category and category != "ALL":
        filtered = [d for d in filtered if d.category == category]
    if state_code and state_code != "ALL":
        filtered = [d for d in filtered if d.state_code == state_code or d.state_code == "ALL"]
    if year:
        filtered = [d for d in filtered if d.year == year]
    if query:
        q = query.lower()
        filtered = [d for d in filtered if q in d.title.lower() or q in d.summary.lower() or q in d.keywords.lower()]

    return filtered

@router.post("/upload", response_model=DocumentResponse)
def upload_document(
    doc_in: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc_id = f"DOC-{uuid.uuid4().hex[:8].upper()}"
    new_doc = Document(
        id=doc_id,
        title=doc_in.title,
        category=doc_in.category,
        author=doc_in.author,
        organization=doc_in.organization,
        year=doc_in.year,
        topic=doc_in.topic,
        region=doc_in.region,
        state_code=doc_in.state_code,
        document_type=doc_in.document_type,
        keywords=",".join(doc_in.keywords),
        summary=doc_in.summary,
        citations=0,
        download_url=f"/api/v1/documents/download/{doc_id}",
        access_level=doc_in.access_level,
        file_size="2.4 MB"
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    audit = AuditLog(
        user_email=current_user.email,
        action="DOCUMENT_UPLOAD",
        resource_type="REPOSITORY",
        details=f"Uploaded document: {doc_in.title} ({doc_id})"
    )
    db.add(audit)
    db.commit()

    return new_doc

@router.get("/{doc_id}", response_model=DocumentResponse)
def get_document(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc
