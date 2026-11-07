# 🧠 Exam Intelligence Hub

An advanced full-stack AI-powered application built to analyze past exam question papers, identify high-yield recurring semantic patterns, and dynamically generate comprehensive study answer keys.

## 🚀 Core Feature Workflow
- **Multi-Document Analysis:** Upload multiple last-year question paper PDFs or text files at once.
- **Pattern Identification:** The processing engine cross-references and evaluates papers for repetitive semantic clusters.
- **Dynamic Answer Generation:** The AI system compiles a structured hit list of priority questions mapped directly to high-scoring standard marking schemes.

## 🛠️ Technical Stack
- **Frontend Framework:** Next.js 15 (React) running on Turbopack compiler architecture.
- **Backend API Engine:** FastAPI (Python) running custom uvicorn server configurations.
- **AI Processing Core:** OpenAI GPT Models integration configured for strict structured output JSON payloads.

## ⚙️ How to Start the App Locally

### 1. Run the Backend API Engine
```bash
# Navigate to project root, activate your environment, and execute:
python backend/main.py
```
*Backend initializes locally on http://127.0.0.1:8000*

### 2. Run the Frontend Development Portal
```bash
cd frontend
npm run dev
```
*Frontend loads locally on http://localhost:3000*
