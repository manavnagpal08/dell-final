# VyomAi Production Backend

This is the production-ready FastAPI backend for VyomAi. It integrates with the Next.js frontend, Supabase, ML prediction models, SHAP explainability, and the Gemini AI Copilot.

## Features

- **Device & Telemetry Management**: CRUD operations for devices and ingestion of telemetry data.
- **Predictive Maintenance Engine**: Evaluates telemetry data to predict failures, calculate risk scores, and estimate remaining days before failure using XGBoost/Scikit-Learn.
- **SHAP Explainability**: Provides human-readable explanations and specific factor weights for AI predictions.
- **AI Copilot**: Integrates with Google Gemini to provide an interactive chat interface for answering questions about system health and alerts.
- **Failure Cascade Analysis**: Generates knowledge graphs of how failures will propagate through the system.
- **Enterprise Integrations**: Mock adapters ready to be connected to Dell OpenManage, HP iLO, Lenovo XClarity, Nagios, etc.
- **Prescriptive Maintenance**: Automatically generates recommended actions based on predicted failure types.

## Tech Stack

- **Framework**: FastAPI (Python 3.11)
- **Database**: Supabase (PostgreSQL)
- **ORM / Validation**: Pydantic & SQLAlchemy
- **Machine Learning**: XGBoost, Scikit-learn, joblib, SHAP
- **Generative AI**: Google Gemini API
- **Containerization**: Docker & Docker Compose

## Quick Start (Local Development)

### 1. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `GEMINI_API_KEY`

### 2. Install Dependencies

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 9000
```

The API will be available at `http://localhost:9000`.
Swagger Documentation: `http://localhost:9000/docs`

### 4. Database Setup

Run the `supabase_schema.sql` script in your Supabase SQL editor to create the necessary tables.

## Docker Deployment

To run the entire backend stack via Docker Compose:

```bash
docker-compose up --build
```

## Production Deployment (Render / Railway)

1. Connect your GitHub repository to the hosting provider.
2. Select the `backend/` directory as the root.
3. Choose Docker as the deployment environment.
4. Add all environment variables from `.env`.
5. Deploy.
