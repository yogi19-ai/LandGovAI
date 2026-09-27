import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import InnovationChallenge, InnovationSubmission, User, AuditLog
from app.schemas import ChallengeCreate, SubmissionCreate
from app.security import get_current_user

router = APIRouter(prefix="/innovation", tags=["Innovation Portal"])

@router.get("/challenges")
def list_challenges(db: Session = Depends(get_db)):
    challs = db.query(InnovationChallenge).all()
    if not challs:
        c1 = InnovationChallenge(
            id="CHALL-2025-01",
            title="Smart India Hackathon 2026: AI & GIS Solutions for Land Governance (PS 26019)",
            category="Hackathon",
            description="Build AI models and GIS decision-support frameworks to streamline land record mutation, detect encroachments, and synthesize policy research.",
            prize_pool="₹1,00,000",
            eligibility="Students, Researchers, Startups",
            deadline="2026-10-31",
            status="Open"
        )
        c2 = InnovationChallenge(
            id="GRANT-2025-04",
            title="MoRD National Research Grant: Climate-Resilient Agro-Forest Zoning",
            category="Research Grant",
            description="Grants up to ₹25 Lakhs for multi-disciplinary academic institutions conducting empirical field research on climate vulnerability in land administration.",
            prize_pool="₹25,000,000",
            eligibility="Academic Institutions & Registered Think Tanks",
            deadline="2026-11-15",
            status="Open"
        )
        db.add_all([c1, c2])
        db.commit()
        challs = db.query(InnovationChallenge).all()

    return challs

@router.post("/submit")
def submit_idea(
    sub_in: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sub_id = f"SUB-{uuid.uuid4().hex[:6].upper()}"
    submission = InnovationSubmission(
        id=sub_id,
        challenge_id=sub_in.challenge_id,
        submitter_email=current_user.email,
        team_name=sub_in.team_name,
        proposal_title=sub_in.proposal_title,
        abstract=sub_in.abstract,
        document_url=sub_in.document_url or "/api/v1/documents/sample-proposal.pdf",
        status="Submitted",
        score=None
    )
    db.add(submission)
    db.commit()

    audit = AuditLog(
        user_email=current_user.email,
        action="INNOVATION_SUBMISSION",
        resource_type="INNOVATION",
        details=f"Submitted proposal '{sub_in.proposal_title}' for challenge {sub_in.challenge_id}"
    )
    db.add(audit)
    db.commit()

    return {
        "status": "SUCCESS",
        "submission_id": sub_id,
        "message": "Innovation proposal submitted successfully. Review status tracked in portal."
    }
