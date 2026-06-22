# Sentinel AI - Comprehensive System Documentation

![Dashboard Overview](../map_screenshot.png)

## 1. Executive Summary
Sentinel AI (VyomAi) is an advanced, AI-powered predictive hardware failure detection platform. Designed to transition IT infrastructure management from a reactive "break-fix" model to a proactive, predictive model, Sentinel AI identifies and mitigates hardware degradation days—or even weeks—before catastrophic failures occur. By integrating high-frequency telemetry analysis with cutting-edge Machine Learning (XGBoost) and Natural Language Processing (NLP) explainability, Sentinel AI significantly reduces unplanned downtime, prevents data loss, and optimizes IT operational budgets.

This documentation serves as a comprehensive overview of the Sentinel AI architecture, its Machine Learning engines, the user interface (Next.js/React), and the underlying data pipeline.

---

## 2. Core Architecture & Technology Stack

The architecture of Sentinel AI is designed for high-throughput, low-latency processing of telemetry data. It follows a decoupled, microservices-oriented approach.

### 2.1 Frontend (User Interface)
The frontend is the primary interface for IT operations and executives.
- **Framework**: Next.js 14 (React) utilizing the App Router for seamless navigation.
- **Styling**: Tailwind CSS for rapid, responsive design, augmented with Framer Motion for micro-interactions and smooth state transitions.
- **Data Visualization**: Recharts is used for rendering complex, interactive time-series graphs (e.g., CPU load vs. thermal limits over time).
- **Component Library**: shadcn/ui and Radix UI primitives provide accessible, highly customizable components.

### 2.2 Backend & APIs
- **Framework**: FastAPI (Python), chosen for its asynchronous capabilities and high performance, essential for processing sub-5-second telemetry streams.
- **Database**: Supabase (PostgreSQL) acts as the primary data store, handling structured relational data, device registries, and historical telemetry logs.
- **Integration Layer**: The backend exposes RESTful endpoints and WebSockets for real-time dashboard updates.

### 2.3 Machine Learning Pipeline
- **Core Models**: Scikit-Learn and XGBoost.
- **Data Processing**: Pandas and NumPy for real-time feature engineering.
- **Inference Latency**: Engineered to provide inference in under 5 seconds.

---

## 3. Machine Learning Engines

Sentinel AI relies on a Dual-Engine Predictive Analytics structure, specifically trained on distinct failure modalities.

![Analytics Deep Dive](../map_screenshot.png)

### 3.1 Storage Failure Prediction Engine
This engine focuses on predicting the degradation of storage media (HDDs, SSDs, NVMe).
- **Input Features**: S.M.A.R.T. (Self-Monitoring, Analysis, and Reporting Technology) metrics. Key indicators include Read Error Rates, Reallocated Sector Counts, Spin Retry Counts, and Wear Leveling indicators.
- **Algorithm**: An XGBoost classifier trained on historical failure datasets (e.g., Backblaze HDD stats).
- **Output**: A probability score indicating the likelihood of failure within a 7-to-30-day window.

### 3.2 Operational Failure Prediction Engine
This engine monitors the immediate, environmental, and operational health of compute nodes.
- **Input Features**: Thermal gradients across the chassis, Fan RPM stability, CPU/GPU utilization curves, and power delivery (voltage rail fluctuations).
- **Algorithm**: A time-series anomaly detection model (Isolation Forest or XGBoost) that establishes a baseline for "normal" operation per device and flags statistically significant deviations.
- **Output**: Identifies immediate risks such as thermal throttling, cooling system failures, or power supply degradation.

### 3.3 The NLP Explainability Layer
One of the most critical features of Sentinel AI is its Explainability Engine. Traditional ML models act as "black boxes," providing a risk score but no context. Sentinel AI translates raw tensor outputs into human-readable insights.
- **Process**: When an anomaly is detected, the feature importance scores (SHAP values) are extracted. These are passed to an NLP template engine that constructs a plain-English diagnosis.
- **Result**: Instead of seeing "Error Code 4X-B," the IT admin sees: *"Warning: The predictive model indicates a 85% probability of thermal failure on Rack 4, Unit B. The primary driver is a 15% drop in Fan 3 RPM combined with a 5°C ambient temperature rise over the last 48 hours."*

---

## 4. User Interface Deep Dive

The Next.js frontend is divided into several key operational modules, each tailored for a specific persona (e.g., L1 Tech Support vs. CIO).

### 4.1 The Map Overview (Digital Twin)
![Map Overview](../map_screenshot.png)

The Map Overview provides a 3D isometric representation of the physical infrastructure.
- **Visual Status**: Devices are color-coded (Emerald, Amber, Red, Slate) based on their real-time health and predicted risk scores.
- **AI Risk Heatmap**: A toggleable overlay that shifts the map's color palette to reflect *predicted risk* rather than current state, allowing operators to literally see the future health of their data center.
- **Interactive Nodes**: Clicking on a specific server rack opens a detailed slide-out panel containing live telemetry, hardware specs, and AI diagnostic reports.

### 4.2 Executive Dashboard & Analytics
The Executive Dashboard aggregates global telemetry into business-centric KPIs.
- **Metrics Tracked**: Total Infrastructure Uptime, Predicted Maintenance Cost Savings, and Global Health Indexes.
- **ROI Calculator**: Automatically quantifies the value of the AI by estimating the downtime prevented (in dollars) when proactive maintenance is performed based on AI alerts.

### 4.3 Automated Maintenance Scheduling & Alerts
When the ML engine flags a high-risk scenario, it triggers an automated workflow.
- **Alert Generation**: Notifications are pushed to the UI, highlighting the specific component at risk.
- **Simulated Ticketing**: The system can automatically draft maintenance tickets (e.g., "Replace Fan Array 2 on Server DB-04") and schedule them during low-impact maintenance windows, pre-empting the catastrophic failure.

---

## 5. Security & Authentication

Sentinel AI utilizes modern security practices.
- **Authentication**: Managed via Supabase Auth, supporting role-based access control (RBAC). 
- **Data Privacy**: Telemetry data is stripped of PII before entering the ML pipeline. All data in transit is encrypted via TLS 1.3.

![Login Screen](../map_screenshot.png)

---

## 6. Future Roadmap

The current iteration of Sentinel AI provides a robust foundation for predictive maintenance. Future enhancements include:
1. **Automated Remediation**: Moving beyond alert generation to actual automated mitigation (e.g., dynamically migrating VMs off a failing host before it crashes).
2. **Federated Learning**: Allowing the ML models to train on anonymized telemetry across multiple client deployments without sharing proprietary data.
3. **Expanded Hardware Support**: Integrating specialized drivers for proprietary network switches and SAN controllers.

---
*End of Documentation. Prepared for Dell Hackathon.*
