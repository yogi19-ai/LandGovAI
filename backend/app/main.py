from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, Document, Workspace, InnovationChallenge
from app.security import get_password_hash
from app.ai.search import ai_search_engine

from app.api import auth, users, documents, datasets, workspaces, gis, analytics, simulation, ai, innovation, dashboard, reports

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed database on startup
@app.on_event("startup")
def startup_seed_db():
    db = SessionLocal()
    try:
        # Seed test users for all 7 RBAC roles
        test_users = [
            ("admin@mord.gov.in", "admin123", "Director General (Admin)", "ADMIN", "Ministry of Rural Development", "DG Admin"),
            ("researcher@iitm.ac.in", "researcher123", "Dr. R. Sundaram", "RESEARCHER", "IIT Madras Policy Cell", "Senior Research Fellow"),
            ("policymaker@niti.gov.in", "policymaker123", "Priyanka Verma", "POLICYMAKER", "NITI Aayog Land Governance Desk", "Policy Adviser"),
            ("official@dolr.gov.in", "official123", "K. V. Ramanathan", "GOVERNMENT_OFFICIAL", "Department of Land Resources (DoLR)", "Joint Secretary"),
            ("inst@iisc.ac.in", "inst123", "IISc Geospatial Lab", "INSTITUTION", "Indian Institute of Science", "Dean Research"),
            ("expert@gisland.org", "expert123", "Dr. Amitabh Sharma", "EXPERT", "GIS & Land Legal Advisory", "Domain Expert"),
            ("public@citizen.in", "public123", "Citizen User", "PUBLIC_USER", "Public", "Public User")
        ]

        for email, pwd, name, role, org, desig in test_users:
            existing = db.query(User).filter(User.email == email).first()
            if not existing:
                u = User(
                    email=email,
                    hashed_password=get_password_hash(pwd),
                    full_name=name,
                    role=role,
                    organization=org,
                    designation=desig
                )
                db.add(u)
        db.commit()

        # Seed initial documents
        if db.query(Document).count() == 0:
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

    finally:
        db.close()

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(datasets.router, prefix=settings.API_V1_STR)
app.include_router(workspaces.router, prefix=settings.API_V1_STR)
app.include_router(gis.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(simulation.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(innovation.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": "National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance",
        "organization": "Ministry of Rural Development, Department of Land Resources (DoLR)",
        "version": "1.0.0-PROTOTYPE",
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }
