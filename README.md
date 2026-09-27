# National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance

**Smart India Hackathon Problem Statement ID:** 26019  
**Organization:** Ministry of Rural Development, Department of Land Resources (DoLR), PME Division  
**Category:** Digital Knowledge Management, Artificial Intelligence, Geospatial Technologies & Evidence-Based Policy Innovation  

---

## Executive Summary

The **National Digital Platform for Land Governance** is a working, data-grounded, enterprise-grade prototype designed for the Ministry of Rural Development and state land administration departments across India. It serves as a centralized knowledge ecosystem connecting researchers, policymakers, government officials, academic institutions, GIS experts, and citizens.

The platform directly addresses all 18 numbered requirements of **Problem Statement 26019**, integrating real-world datasets (DILRMP RoR computerization rates, ISRO Bhuvan Land Use/Land Cover decadal satellite statistics, High Court revenue litigation digests, and SVAMITVA rural property mapping).

---

## Key Features & Requirement Mapping

| PS Requirement | Feature Description | System Module |
| :--- | :--- | :--- |
| **Req 7** | **Centralized Digital Repository** — Metadata-indexed repository for research papers, policy briefs, legal statutes, case studies, and reports with preview and upload. | `DigitalRepository` / `/api/v1/documents` |
| **Req 8** | **AI Search & Recommendation Engine** — Natural language semantic vector search with match relevance scores and recommended contextual reading. | `AISearchView` / `/api/v1/ai/search` |
| **Req 9** | **Collaborative Workspaces** — Inter-institutional research projects, member role assignment, milestone task boards, and activity tracking. | `WorkspacesView` / `/api/v1/workspaces` |
| **Req 10** | **Interactive GIS Visualization** — Leaflet map with interactive Indian state spatial polygons, layer controls (Cadastral vectorization, Climate risk index, Dispute hotspots), popups, and legends. | `GISExplorer` / `/api/v1/gis` |
| **Req 11** | **Advanced Analytics & Decision Support** — Pandas/NumPy statistical analysis, decadal land use transition trends, dispute driver matrices, and Scikit-Learn linear regression dispute forecasting. | `AnalyticsView` / `/api/v1/analytics` |
| **Req 12** | **Policy Simulation Lab** — Mathematical ex-ante impact simulator comparing baseline vs proposed scenarios (Cadastral acceleration, Climate buffer zoning, Urban land pooling) with explicit prototype disclaimers. | `PolicySimulatorView` / `/api/v1/simulation` |
| **Req 13** | **Multi-Source Data Integration** — Unified ingestion pipeline for satellite imagery, remote sensing, land records, socio-economic census data, and DILRMP statistics. | `DatasetCatalogue` / `/api/v1/datasets` |
| **Req 14** | **AI-Assisted Research Toolkit** — Automated literature synthesis engine, trend detector, predictive modeler, and evidence-grounded AI research assistant chatbot. | `AIResearchToolkitView` / `/api/v1/ai` |
| **Req 15** | **Innovation Portal** — Hackathons, MoRD research grants, pilot project competitions, idea submission tracking, and evaluation workflow. | `InnovationPortal` / `/api/v1/innovation` |
| **Req 16** | **National Dashboards** — KPI cards (RoR computerization %, Cadastral vectorization %, Litigation reduction, SVAMITVA titles), time-series land use graphs, and state comparative rankings. | `NationalDashboard` / `/api/v1/dashboard` |
| **Req 17** | **Secure Role-Based Access (RBAC)** — Authentication, JWT token handling, 7 system roles (`ADMIN`, `RESEARCHER`, `POLICYMAKER`, `GOVERNMENT_OFFICIAL`, `INSTITUTION`, `EXPERT`, `PUBLIC_USER`), and audit logging. | `UserManagementView` / `/api/v1/users` |
| **Req 18** | **REST API Architecture** — OpenAPI/Swagger documentation (`/docs`), standardized REST routes, schema validation, and error handling. | `APIIntegrationView` / `/docs` |

---

## Technology Architecture

- **Frontend:** React.js + TypeScript + Vite + Tailwind CSS + Lucide Icons + Recharts + Leaflet.js
- **Backend:** Python FastAPI + Pydantic + SQLAlchemy + Uvicorn + PyJWT + Passlib
- **AI & Data Science:** Python Pandas + NumPy + Scikit-Learn + TF-IDF Vector Search Engine
- **GIS:** GeoJSON spatial polygon features + Leaflet Dark Basemaps
- **Database:** SQLite (local prototype) / PostgreSQL + PostGIS (production ready)

---

## Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 2. Backend Setup & Launch
```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI backend server (Port 8000)
python run.py
```
*Backend interactive Swagger docs available at: `http://localhost:8000/docs`*

### 3. Frontend Setup & Launch
```bash
# Navigate to frontend
cd frontend

# Install Node modules
npm install

# Start Vite dev server (Port 3000)
npm run dev
```
*Access Web App at: `http://localhost:3000`*

---

## Seed Test Credentials (7 Roles)

| Role | Email | Password | User Description |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@mord.gov.in` | `admin123` | Director General (Admin) |
| **RESEARCHER** | `researcher@iitm.ac.in` | `researcher123` | Dr. R. Sundaram (IIT Madras) |
| **POLICYMAKER** | `policymaker@niti.gov.in` | `policymaker123` | Priyanka Verma (NITI Aayog) |
| **GOVERNMENT_OFFICIAL** | `official@dolr.gov.in` | `official123` | K. V. Ramanathan (DoLR JS) |
| **INSTITUTION** | `inst@iisc.ac.in` | `inst123` | IISc Geospatial Lab Admin |
| **EXPERT** | `expert@gisland.org` | `expert123` | Dr. Amitabh Sharma (GIS Board) |
| **PUBLIC_USER** | `public@citizen.in` | `public123` | Citizen User |

---

## Verification & Traceability
Refer to [`REQUIREMENTS_TRACEABILITY.md`](./REQUIREMENTS_TRACEABILITY.md) for the detailed matrix mapping every problem statement requirement to backend APIs, database models, frontend views, and verification statuses.
"# LandGovAI" 
"# LandGovAI" 
