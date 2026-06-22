# Sentinel AI (Vyom AI) - Technical Documentation

Welcome to the Technical Documentation for **Sentinel AI** (deployed under the project name Vyom AI). This document provides an in-depth look at the architecture, tech stack, data flow, and setup instructions.

---

## 🏗️ Architecture & Tech Stack

Sentinel AI uses a modern, decoupled architecture designed for high throughput, real-time updates, and robust AI inference.

### 1. Frontend (Next.js 14 / App Router)
- **Framework**: Next.js (React)
- **Styling**: TailwindCSS & Framer Motion (Glassmorphism, dynamic SVG animations).
- **State Management**: React Hooks & Server/Client Component Hybrid.
- **Role**: Renders the digital twin dashboard, visualizes geospatial device layouts (Isometric Map), and handles user interactions.
- **Hosting**: Firebase Web Frameworks (Serverless).

### 2. Backend (Python / FastAPI)
- **Framework**: FastAPI (Async-native Python framework).
- **ML Integration**: XGBoost model for predictive failure analysis and anomaly detection.
- **Background Tasks**: Generates simulated high-frequency telemetry data to feed the dashboard.
- **Role**: Serves as the middle layer between the AI model, the database, and the frontend.

### 3. Database (Supabase / PostgreSQL)
- **Database**: PostgreSQL (via Supabase).
- **Features Used**: Supabase REST API for seamless data fetching and real-time capable schemas.
- **Role**: Stores devices, historical telemetry, predictive alerts, and user profiles.

---

## 🗄️ Database Schema

The system relies on three core tables:

### `devices`
Represents physical hardware (Servers, HVAC units, Network Switches) on the campus.
- `id` (UUID, Primary Key)
- `name` (String, e.g., "AI Training Cluster")
- `type` (String, e.g., "Server", "Cooling")
- `status` (Healthy, Warning, Critical, Offline)
- `risk_score` (Integer, 0-100 computed by ML)
- `predicted_failure_type` (String, nullable)

### `telemetry_records`
High-frequency time-series data captured from the devices.
- `id` (UUID, Primary Key)
- `device_id` (Foreign Key -> devices.id)
- `temperature`, `cpu_usage`, `memory_usage`, `power_draw` (Float)
- `timestamp` (DateTime)

### `alerts`
Incidents automatically generated when risk scores exceed thresholds.
- `id` (UUID)
- `device_id` (Foreign Key)
- `severity` (Low, Medium, High, Critical)
- `message` (String)

---

## 🧠 AI Integration (XGBoost)

The core brain of Sentinel AI is powered by **XGBoost**.
1. **Data Ingestion**: Telemetry data (Temperature, Load, Power Variance) is fed into the FastAPI backend.
2. **Feature Engineering**: The backend computes rate-of-change and historical averages.
3. **Inference**: The XGBoost model calculates a `risk_score` (0-100%).
4. **Classification**: If the score > 85%, it classifies a specific `predicted_failure_type` (e.g., Thermal Throttling) and estimates `days_remaining`.

---

## 🚀 Local Development Setup

To run the complete system locally, you need two terminal windows.

### 1. Start the FastAPI Backend
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 9000
```

### 2. Start the Next.js Frontend
```bash
cd sentinel-ai # (Root folder)
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## 📡 API Endpoints

The FastAPI backend exposes the following primary routes:

- `GET /api/v1/devices`: Retrieves all devices and their current ML risk states.
- `GET /api/v1/devices/{id}/telemetry`: Retrieves historical time-series data for chart rendering.
- `POST /api/v1/devices/{id}/telemetry`: Endpoint for physical sensors to push new data into the pipeline.

---

## 🔒 Security & Extensibility
- **Row Level Security (RLS)**: Implemented at the Supabase layer.
- **Modularity**: New AI models (like PyTorch/TensorFlow) can easily be swapped into the FastAPI backend without altering the frontend or database schemas.
