**🏙️ CivicLens – AI-Powered Civic Issue Reporting**

CivicLens is an AI-driven civic complaint reporting and routing system that empowers citizens to report issues, ensures faster redressal by authorities, and strengthens transparency in governance.

This repository contains the final CivicLens implementation including frontend + backend integration.

Deployed Prototype: https://civiclens-five.vercel.app/

**📖 Overview**

Citizens face civic problems daily – potholes, garbage piles, sewage leaks, broken streetlights, waterlogging.
Existing systems are often slow, unclear, and inaccessible. CivicLens solves this by combining citizen reporting with AI-based validation, prioritization, and routing.

👤 Citizens can easily report issues (photo + description + location).

🤖 AI validates if the issue is genuine, analyzes severity (1–10), and tags it.

🏛️ Issue is automatically mapped to the right government departments (multi-department support).

⚡ Provides step-by-step actionable suggestions for authorities to resolve issues faster.

📊 Transparent dashboards + gamification for citizens to stay engaged.

**✨ Features**
👤 Citizen Features

📷 Upload issue photos (roads, garbage, sewage, etc.).

📍 Automatic location tagging via GPS.

📝 Add description & select category.

🌍 Multi-language support (English, Hindi, Tamil, Telugu, Kannada, Gujarati, Bengali).

🗺️ Interactive map of civic complaints.

📊 Dashboard to track personal reports.

🏆 Leaderboard for active contributors.

🎖️ Certificates of Civic Impact for engaged citizens.

🏛️ Authority Features

✅ AI Verification (filter spam/irrelevant complaints).

⚡ Severity rating (1–10 scale).

🗂️ Multi-department routing (issue can go to 2–3 depts if required).

📊 Priority assignment (High / Medium / Low).

🛠️ Action plan generation (step-by-step + extra suggestions).

🔍 Transparent workflow for accountability.

🌍 Community Features

🚀 Faster complaint resolution.

🧑‍🤝‍🧑 Stronger citizen-government trust.

📈 Data-driven governance.

🌱 Cleaner, safer, more sustainable neighborhoods.

**🖥️ Technical Features**

Node.js backend with Express API.

Gemini 2.5 Flash AI for text + image analysis.

Sharp for image compression (ensures API size limits).

Static HTML/JS frontend (citizen dashboard).

Extensible category → department mapping (Chennai model).

Fallback logic ensures complaint still processes even if AI fails.

**🔄 System Workflow**
flowchart TD
    A[Citizen uploads photo + description + location] --> B[Stage 0: AI Verification]
    B -->|Valid| C[Stage 1: AI Severity Analysis]
    B -->|Invalid| Z[Rejected with reason]
    C --> D[Stage 2: Department Routing]
    D --> E[Priority Assignment]
    E --> F[Step-by-step Suggestions]
    F --> G[Assigned to Relevant Departments]
    G --> H[Authorities Resolve + Feedback to Citizen]

**🛠️ Tech Stack
**
Backend: Node.js (Express)

AI: Google Gemini 2.5 Flash API

Frontend: HTML, CSS, JS

Image Processing: Sharp (WebP compression)

Database: (Optional) Firebase / MongoDB for report storage

Deployment: Works on Heroku, Vercel, AWS, or local server

**🚀 Getting Started**
1. Clone Repo
git clone https://github.com/your-org/civiclens-final.git
cd civiclens-final

2. Install Dependencies
npm install

3. Configure Environment

Create a .env file:

GEMINI_API_KEY=your_google_gemini_api_key
PORT=3000

4. Run Server
npm start


Visit: http://localhost:3000

📂 Project Structure
civiclens-final/
├── server.js              # Node.js backend (AI + routing)
├── public/                # Frontend (citizen web app)
│   ├── index.html          # Main entry point
│   ├── homepage.html       # Dashboard
│   ├── map.html            # Complaint map
│   ├── leaderboard.html    # Gamification
│   ├── certificate.html    # Civic contribution certificate
│   ├── myreports.html      # My complaints
│   ├── myimpact.html       # Impact stats
│   └── locales/            # Multi-language JSON files
├── package.json
├── README.md               # Default README
└── README_DETAILED.md      # This file

📡 API Endpoints
POST /api/analyze-issue

Analyze a civic complaint.

Body (multipart/form-data):

photo (image, required)

location (string)

description (string)

category (string, one of supported categories)

Response Example:

{
  "severity": 8,
  "aiDescription": "Sewage overflow on roadside",
  "keywords": ["sewage", "overflow", "sanitation"],
  "priority": "High Priority",
  "departments": [
    "CMWSSB (Water & Sewage)",
    "Public Health Department (GCC)",
    "Storm Water Drain Department (GCC)"
  ],
  "considerations": [
    "1) Acknowledge and create a work ticket",
    "2) Dispatch sewage clearance team",
    "3) Jet-rodding unclogging of manhole",
    "4) Sanitization with bleaching powder",
    "5) Mosquito control spraying",
    "Suggestions: Schedule preventive desilting"
  ],
  "timestamp": "2025-09-29T10:12:34.123Z"
}

GET /api/health

Check if backend + AI is working.

{ "status": "OK", "model": "gemini-2.5-flash" }

📂 Categories & Departments (Chennai)

Roads → Roads Dept (GCC, PWD)

Waste Management → Solid Waste Management Dept (GCC)

Infrastructure → Buildings Dept (Public Buildings)

Street Lighting → Electrical Dept (GCC)

Water & Sewage → CMWSSB

Political Issues / Vandalism → Enforcement & Law Dept (GCC)

Public Health & Sanitation → Public Health Dept (GCC)

Parks & Green Spaces → Parks Dept (GCC)

Encroachments & Illegal Constructions → Town Planning & Enforcement (GCC)

Noise & Air Pollution → TNPCB + Public Health Dept (GCC)

Flooding & Drainage → Storm Water Drain Dept (GCC)

Traffic & Parking → Chennai Traffic Police + Roads Dept (GCC)

Electricity & Power → TANGEDCO

Public Transport & Bus Stops → MTC + CMRL

Drinking Water Quality → CMWSSB

**📊 Roadmap**

✅ Chennai civic department mapping (15 categories)

✅ Multi-language support

✅ Citizen gamification (leaderboards + certificates)

🔜 Expand to other cities (custom department mappings)

🔜 Mobile PWA app version

🔜 Predictive AI for proactive issue detection

🔜 Analytics dashboard for administrators

**🤝 Contributing**

Fork repo

Create branch: git checkout -b feature-name

Commit changes: git commit -m "Added new feature"

Push branch and open PR
