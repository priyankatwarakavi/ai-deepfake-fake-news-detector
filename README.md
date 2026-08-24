# Aegis.AI - AI-Powered Deepfake and Fake News Detection System

This repository contains the full-stack implementation of the **Aegis.AI - AI-Powered Deepfake and Fake News Detection System**. The platform combines advanced Natural Language Processing (NLP) models for linguistic analysis and Computer Vision (CV) models for media splice diagnostics, providing a complete sandbox for factcheckers, forensics developers, and system administrators.

## Features

* **Multi-Modal Verification Pipeline** — Unified NLP (text/URLs) and Computer Vision (images/videos) checkers.
* **Role-Based Access Control (RBAC)** — Secure JWT session authentication for users and administrators.
* **Sensationalism & Clickbait Auditing** — Lexical analysis of emotional shouting ratios and vocabulary bias.
* **Facial Splice & Blending Diagnostics** — Keyframe-by-keyframe analysis mapping visual manipulation markers.
* **Quantization Error Checks** — Chrominance channel compression analysis to locate splice patterns.
* **On-Demand Forensic Certificates** — Automated PDF report compilation utilizing ReportLab flowables.
* **Global Activity Stream** — Live audit logs and daily diagnostics load dashboards for administrators.
* **Flexible Cloud/Offline Database** — Seamless MongoDB Atlas integration with local thread-safe JSON store fallback.
* **Containerized Infrastructure** — Modular backend and frontend deployments using Docker Compose.

## Pipeline

### Fake News NLP Detection Flow
```text
  User Input (Text / URL)
           │
           ▼
┌─────────────────────────┐
│      1. NLP Parser      │ ───► Extract capitalization & Clickbait expressions
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│   2. Domain Verifier    │ ───► Cross-check domain host against credibility index
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│   3. Sentiment Scorer   │ ───► Lexical emotional sentiment evaluation
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│   4. Result Compiler    │ ───► Compute final Fake/Real rating and explanations
└─────────────────────────┘

###Deepfake Media CV Detection Flow
  User Ingestion (Image / Video)
           │
           ▼
┌─────────────────────────┐
│  1. Metadata Extractor  │ ───► Ingest dimensions, codecs, and file structures
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  2. Landmark Matcher    │ ───► Map facial landmark coordinates and mesh counts
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  3. Pixel Diagnostics   │ ───► Inspect boundary blending and quantization noise
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  4. Keyframe Profiler   │ ───► Calculate frame-by-frame manipulation values

└─────────────────────────┘
##Report Generation Flow
    Diagnostic Records
           │
           ▼
┌─────────────────────────┐
│   5. DB Persistence     │ ───► Write data to MongoDB or local JSON store
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  6. PDF Canvas Builder  │ ───► Build dynamic data tables and progress charts
└─────────────────────────┘
           │
           ▼
   Downloadable PDF Report
    Diagnostic Records
           │
           ▼
┌─────────────────────────┐
│   5. DB Persistence     │ ───► Write data to MongoDB or local JSON store
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  6. PDF Canvas Builder  │ ───► Build dynamic data tables and progress charts
└─────────────────────────┘
           │
           ▼
   Downloadable PDF Report
Project Structure
app/
├── config.py              # Application settings configuration via Pydantic
├── database.py            # MongoDB Atlas connection with local JSON fallback
├── auth.py                # Password bcrypt salting and JWT role checks
├── main.py                # FastAPI app factory, middleware, and router mounts
├── services/
│   ├── news_detector.py   # NLP lexical evaluation and domain audit service
│   ├── deepfake_detector.py # CV face mesh and compression anomaly checker
│   └── report_generator.py # PDF report certificate compilation (ReportLab)
└── routers/
    ├── auth.py            # Registration, login, and verification endpoints
    ├── users.py           # Profile queries and admin role management
    ├── detector.py        # Core NLP and media detection endpoints
    ├── reports.py         # Report compilation and PDF file streaming
    └── analytics.py       # Dashboard stats and administrative activity feeds
data/                      # Local fallback directory for database and uploads
docs/                      # Documentation markdown directory
Dockerfile                 # Container setup for FastAPI service
docker-compose.yml         # Unified Docker service manager
requirements.txt           # Python backend dependencies
Getting Started
Prerequisites
Python 3.10+
Node.js v20.11+
Docker & Docker Compose (optional)
Local Development
Activate the Backend Virtual Environment & Install Packages:
cd backend
python -m venv venv
source venv/Scripts/activate      # On Windows (PowerShell: .\venv\Scripts\Activate.ps1)
pip install -r requirements.txt
Verify Endpoints with Automated Testing Suite:
python ../verify_backend.py
Start the FastAPI Backend Service:
python -m uvicorn app.main:app --reload --port 8000
Initialize and Start the Next.js Frontend: Open a new terminal window:
cd frontend
$env:PATH = "..\node\node-v20.11.1-win-x64;" + $env:PATH
npm install --legacy-peer-deps
npm run dev
Docker Compose
Starts both backend and frontend applications in orchestrating containers:
docker compose up --build
Environment Variables
All settings live in backend/app/config.py and can be overridden via env vars or .env:
Here is the **complete, copy-pasteable `README.md`** content with the environment variables table made concise and formatted exactly like the layout in your images:

```markdown
# Aegis.AI - AI-Powered Deepfake and Fake News Detection System

This repository contains the full-stack implementation of the **Aegis.AI - AI-Powered Deepfake and Fake News Detection System**. The platform combines advanced Natural Language Processing (NLP) models for linguistic analysis and Computer Vision (CV) models for media splice diagnostics, providing a complete sandbox for factcheckers, forensics developers, and system administrators.

## Features

* **Multi-Modal Verification Pipeline** — Unified NLP (text/URLs) and Computer Vision (images/videos) checkers.
* **Role-Based Access Control (RBAC)** — Secure JWT session authentication for users and administrators.
* **Sensationalism & Clickbait Auditing** — Lexical analysis of emotional shouting ratios and vocabulary bias.
* **Facial Splice & Blending Diagnostics** — Keyframe-by-keyframe analysis mapping visual manipulation markers.
* **Quantization Error Checks** — Chrominance channel compression analysis to locate splice patterns.
* **On-Demand Forensic Certificates** — Automated PDF report compilation utilizing ReportLab flowables.
* **Global Activity Stream** — Live audit logs and daily diagnostics load dashboards for administrators.
* **Flexible Cloud/Offline Database** — Seamless MongoDB Atlas integration with local thread-safe JSON store fallback.
* **Containerized Infrastructure** — Modular backend and frontend deployments using Docker Compose.

## Pipeline

### Fake News NLP Detection Flow
```text
  User Input (Text / URL)
           │
           ▼
┌─────────────────────────┐
│      1. NLP Parser      │ ───► Extract capitalization & Clickbait expressions
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│   2. Domain Verifier    │ ───► Cross-check domain host against credibility index
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│   3. Sentiment Scorer   │ ───► Lexical emotional sentiment evaluation
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│   4. Result Compiler    │ ───► Compute final Fake/Real rating and explanations
└─────────────────────────┘
```

### Deepfake Media CV Detection Flow
```text
  User Ingestion (Image / Video)
           │
           ▼
┌─────────────────────────┐
│  1. Metadata Extractor  │ ───► Ingest dimensions, codecs, and file structures
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  2. Landmark Matcher    │ ───► Map facial landmark coordinates and mesh counts
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  3. Pixel Diagnostics   │ ───► Inspect boundary blending and quantization noise
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  4. Keyframe Profiler   │ ───► Calculate frame-by-frame manipulation values
└─────────────────────────┘
```

### Report Generation Flow
```text
    Diagnostic Records
           │
           ▼
┌─────────────────────────┐
│   5. DB Persistence     │ ───► Write data to MongoDB or local JSON store
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  6. PDF Canvas Builder  │ ───► Build dynamic data tables and progress charts
└─────────────────────────┘
           │
           ▼
   Downloadable PDF Report
```

## Project Structure

```text
app/
├── config.py              # Application settings configuration via Pydantic
├── database.py            # MongoDB Atlas connection with local JSON fallback
├── auth.py                # Password bcrypt salting and JWT role checks
├── main.py                # FastAPI app factory, middleware, and router mounts
├── services/
│   ├── news_detector.py   # NLP lexical evaluation and domain audit service
│   ├── deepfake_detector.py # CV face mesh and compression anomaly checker
│   └── report_generator.py # PDF report certificate compilation (ReportLab)
└── routers/
    ├── auth.py            # Registration, login, and verification endpoints
    ├── users.py           # Profile queries and admin role management
    ├── detector.py        # Core NLP and media detection endpoints
    ├── reports.py         # Report compilation and PDF file streaming
    └── analytics.py       # Dashboard stats and administrative activity feeds
data/                      # Local fallback directory for database and uploads
docs/                      # Documentation markdown directory
Dockerfile                 # Container setup for FastAPI service
docker-compose.yml         # Unified Docker service manager
requirements.txt           # Python backend dependencies
```

## Getting Started

### Prerequisites

* Python 3.10+
* Node.js v20.11+
* Docker & Docker Compose (optional)

### Local Development

1. **Activate the Backend Virtual Environment & Install Packages**:
   ```bash
   cd backend
   python -m venv venv
   source venv/Scripts/activate      # On Windows (PowerShell: .\venv\Scripts\Activate.ps1)
   pip install -r requirements.txt
   ```

2. **Verify Endpoints with Automated Testing Suite**:
   ```bash
   python ../verify_backend.py
   ```

3. **Start the FastAPI Backend Service**:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

4. **Initialize and Start the Next.js Frontend**:
   *Open a new terminal window:*
   ```bash
   cd frontend
   $env:PATH = "..\node\node-v20.11.1-win-x64;" + $env:PATH
   npm install --legacy-peer-deps
   npm run dev
   ```

### Docker Compose

Starts both backend and frontend applications in orchestrating containers:
```bash
docker compose up --build
```

## Environment Variables

All settings live in `backend/app/config.py` and can be overridden via env vars or `.env`:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `JWT_SECRET` | `super-secret-key-change-in-production-aegis-shield` | Session encryption passphrase key |
| `DATABASE_NAME` | `deepfake_detector` | MongoDB database namespace |
| `MONGODB_URL` | `(empty)` | MongoDB Atlas URI connection string (leaves empty for local fallback) |
| `CLOUDINARY_CLOUD_NAME` | `(empty)` | Cloudinary Cloud Identifier (optional) |
| `CLOUDINARY_API_KEY` | `(empty)` | Cloudinary Access Key (optional) |
| `CLOUDINARY_API_SECRET` | `(empty)` | Cloudinary Private Token (optional) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` | Next.js query endpoint URL location |
## API

### Health Check

`GET /`
Returns the operational health and connection status of the backend server.

Response:
```json
{
  "status": "online",
  "message": "AI-Powered Deepfake and Fake News Detection System API is running successfully.",
  "version": "1.0.0"
}
###Detection Pipeline
POST /api/detect/news Ingests text content or web urls to perform NLP classification heuristics.

JSON body:
{
  "text": "SHOCKING SECRET CONSPIRACY EXPOSED! The government is hiding the miracle cure!",
  "url": "https://realnews24.com/exposed"
}
###Input validation:

text — must be non-empty if URL is not provided.
url — must be a valid URL string structure.
Response:
{
  "id": "c1a9f1a2-5b9c-4d8e-9f0a-1b2c3d4e5f6g",
  "result": "Fake",
  "confidence": 96.4,
  "sentiment": "Negative",
  "sentimentScore": 0.3,
  "sourceCredibility": 15.0,
  "explanation": "Contains high-intensity sensationalist phrases. Uses excessive capitalization."
}
Example:
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"text":"Sensational headline here","url":"https://suspiciousdomain.net"}' \
  http://localhost:8000/api/detect/news
POST /api/detect/deepfake Uploads raw image or video files to execute Computer Vision forensics.

Form fields:

file — raw image or video file (required; validated against content headers).
Response:
{
  "id": "e2b9f2a3-6b0c-5d9e-0f1a-2b3c4d5e6f7g",
  "result": "Fake",
  "confidence": 92.4,
  "facesDetected": 1,
  "manipulationScore": 92.4,
  "anomalies": [
    "Asymmetry in iris light reflections detected on primary face.",
    "Boundary blending inconsistencies around mouth and jawline."
  ],
  "frames": [
    {
      "frame": 0,
      "score": 92.4,
      "facesDetected": 1,
      "boundingBox": [0.2, 0.3, 0.6, 0.7],
      "anomalyDetected": true
    }
  ],
  "metadata": {
    "fileName": "test_video.mp4",
    "fileType": "video/mp4",
    "dimensions": "1920x1080",
    "codec": "H.264 / AVC"
  },
  "mediaUrl": "/static/uploads/file-uuid.mp4"
}
Example:
curl -X POST \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "file=@face_swap_video.mp4" \
  http://localhost:8000/api/detect/deepfake
###Reports Management
POST /api/reports/generate/{analysis_type}/{analysis_id} Generates a dynamic ReportLab PDF verification certificate for the given audit ID.

Response:
{
  "reportId": "d3c9f3a4-7b1c-6d0e-1f2a-3b4c5d6e7f8g",
  "downloadUrl": "/api/reports/download/d3c9f3a4-7b1c-6d0e-1f2a-3b4c5d6e7f8g"
}
GET /api/reports/download/{report_id} Streams the compiled physical PDF report file directly to the client.

Response:

File Stream: application/pdf binary stream.
Verification Testing
verify_backend.py is a standalone testing suite for asserting all routing, auth permissions, and analytical calculations offline.

Run the test suite:
python verify_backend.py
The script automatically resets temporary databases, registers the admin user, mocks uploads, generates reports, and verifies dashboard calculations.
##Notes
JWT Verification: Auth validation checks JWT payloads inside the request header (Authorization: Bearer <token>). Token expiry is set to 24 hours (1440 minutes).
Database Fallback: When MongoDB Atlas connection errors are caught, the system defaults to thread-safe local JSON document read/writes inside backend/data/.
Mock AI Rule Engine: Video frame processing is calculated via reproducible seeding based on filename checksum values to ensure consistent test results.
Security & Salting: Hashing is processed using direct standard bcrypt packages, preventing dependency compilation errors on newer Python installations.
Admins Assignment: The first registered user is automatically designated as an Administrator; subsequent accounts default to the Standard User tier.
