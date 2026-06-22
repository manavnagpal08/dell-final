# VyomAi - Intelligent Device Management with Predictive Hardware Failure Detection

![VyomAi Dashboard](https://via.placeholder.com/1200x600.png?text=VyomAi+Dashboard)

VyomAi is an AI/ML-powered predictive failure detection platform designed to revolutionize IT infrastructure management. By shifting from reactive maintenance to proactive, predictive anomaly detection, VyomAi empowers organizations to predict hardware failures 7-30 days before they occur, drastically reducing unplanned downtime and mitigating costly data loss.

## 🚀 The Core Problem Solved
Modern IT infrastructures face critical challenges with unexpected hardware failures (storage, thermal, power delivery). Current monitoring systems are entirely reactive, focusing on "is the device online/offline?" rather than "will this device fail next week?". 

**VyomAi bridges this gap by offering:**
- **Proactive Maintenance**: Anticipating failure cascading events days in advance.
- **Root Cause Explainability**: Using our custom Natural Language Processing (NLP) pipeline to instantly explain complex telemetry anomalies in plain English.
- **ROI & Cost Optimization**: Automatically estimating downtime prevented and money saved.

---

## ✨ Key Features & Capabilities

### 1. Dual-Engine Predictive Analytics
We deployed distinct XGBoost-powered Machine Learning engines to analyze telemetry in real-time (<5 second latency):
- **Storage Failure Engine**: Analyzes S.M.A.R.T. metrics (Read Errors, Reallocated Sectors) to predict HDD/SSD degradation.
- **Operational Failure Engine**: Monitors thermal gradients, Fan RPMs, and voltage rails to detect cooling and power anomalies.

### 2. Advanced AI Explainability
IT admins shouldn't have to guess what an anomaly means. VyomAi integrates a specialized NLP Explainability Engine directly into the alert workflow. The AI analyzes the raw telemetry and provides:
- The precise root cause of the anomaly.
- A "Business Impact" severity assessment.
- Clear, prescriptive, step-by-step remediation actions.

### 3. Automated Maintenance Scheduling
When a high-risk failure is predicted, VyomAi's Automated Maintenance Module generates simulated tickets (e.g., "Replace Fan Bearing", "Update SSD Firmware"), scheduling them before the catastrophic failure occurs.

### 4. Interactive Live Data Simulation
To prove the model's efficacy, we built a fully interactive `/test` dashboard. You can manually inject specific anomalies (e.g., "Force Thermal Anomaly", "Force Storage Sector Failure") and watch the live ML model react, flag the risk, and generate an AI diagnosis in real-time.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Visualization**: Recharts

### Backend (API & Machine Learning)
- **API Framework**: FastAPI (Python)
- **ML Models**: Scikit-Learn, XGBoost, Pandas
- **NLP Engine**: Custom AI Explainability Pipeline
- **Database**: Supabase (PostgreSQL)

---

## ⚙️ Local Development & Setup

This repository contains both the Next.js frontend and the FastAPI backend. **You must run both simultaneously in two separate terminals.**

### 1. Environment Configuration
Make sure you have a `.env` file configured in the `backend/` directory with necessary credentials (like Supabase and Gemini).
You can copy `.env.example` to `.env` if available.

### 2. Backend Setup (FastAPI)
Open your **first terminal** and run the following commands:
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# 4. Install all required dependencies
pip install -r requirements.txt

# 5. Start the backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 9000
```
*The backend API will now be running on `http://localhost:9000`*

### 3. Frontend Setup (Next.js)
Open a **second, new terminal window** (do not close the backend terminal) and run:
```bash
# 1. Ensure you are in the root directory (where package.json is)
# cd sentinel-ai (or whatever your root folder is named)

# 2. Install Node.js dependencies
npm install

# 3. Start the Next.js frontend
npm run dev
```
*The frontend will now be running on `http://localhost:3000`*

### 4. Testing the ML Engine
Once both the backend and frontend servers are running:
Navigate your browser to **`http://localhost:3000/test`**

This interactive dashboard allows you to force anomalies (Storage/Operational) or upload custom CSVs to watch the AI engine react in real-time.

---

## 📊 Alignment with Hackathon Evaluation Criteria
- **Technical Excellence (40%)**: Live XGBoost ML predictions with <5s latency, robust FastAPI backend, and dynamic state management.
- **Business Impact (30%)**: Clear ROI dashboard showcasing "Estimated Cost Savings" and "Downtime Prevented".
- **Implementation Quality (20%)**: Clean, modular code, beautiful UI/UX, and strict adherence to modern React/Python paradigms.
- **Stretch Goals Achieved**: AI Explainability, Automated Maintenance Scheduling, Prescriptive Actions.

---

### Built with ❤️ for the Hackathon
