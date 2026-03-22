# 🎓 AI Interview Coaching System

A comprehensive, multi-modal AI platform designed to conduct realistic technical interviews, analyze candidate performance in real-time, and provide actionable feedback.

The system uses a suite of specialized AI agents to evaluate candidates not just on *what* they say, but *how* they say it—analyzing verbal content, vocal delivery, and non-verbal cues simultaneously.

---

## 🚀 Key Features

-   **🤖 Interactive AI Interviewer**: A conversational agent (powered by Llama 3 via Groq) that conducts the interview, asks branch-specific or resume-based technical questions.
-   **📹 Real-Time Video Analysis**: Tracks facial expressions and emotions (confidence, nervousness, happiness) using Computer Vision.
-   **🎙️ Vocal Remediation**: Analyzes speech patterns, pitch, loudness, and stability to detect hesitation or anxiety.
-   **📝 Smart Transcription**: Converts candidate speech to text for content accuracy scoring.
-   **📄 Resume Integration**: Parses uploaded resumes to generate personalized questions tailored to the candidate's projects and skills.
-   **📊 Live Feedback**: Provides immediate scoring feedback during the session.
-   **⚡ Low Latency**: Uses WebSocket streaming for real-time audio/video processing.
-   **🗣️ Neural TTS**: High-quality, local Text-to-Speech (Piper) for the AI interviewer's voice.
-   **📈 Automated Reporting**: Generates comprehensive PDF reports and emails them to candidates post-interview.

---

## 🏗️ Architecture & Technologies

The project follows a modular client-server architecture with specialized agents handling distinct analysis tasks.

### **Backend (`/backend`)**
Built with **FastAPI** for high-performance async processing.

*   **Core Framework**: `FastAPI`, `Uvicorn`
*   **Database**: `MongoDB` (using `Motor` driver for async operations)
*   **Communication**: `WebSockets` for full-duplex real-time streams.
*   **Data Processing**: `ThreadPoolExecutor` for non-blocking ML inference.
*   **Agents**:
    *   **🧠 Brain Agent** (`backend/brain_agent`): Orchestrates the interview flow. Uses **LangChain** + **Groq (Llama 3.3-70b)** for logic, question generation, and branch classification.
    *   **🗣️ Verbal Agent** (`backend/verbal_agent`): Handles Speech-to-Text using **Google Web Speech API** (via `SpeechRecognition`) and scores answer content using semantic analysis.
    *   **👀 Non-Verbal Agent** (`backend/non_verbal_agent`): Uses **DeepFace** and **OpenCV** to detect facial emotions and engagement levels from video frames.
    *   **🔊 Vocal Agent** (`backend/vocal_agent`): Uses **Librosa** and **Numpy** to extract audio features (pitch, RMS energy/loudness, spectral stability) to assess vocal confidence.
    *   **🗣️ TTS Agent** (`backend/tts_agent`): Uses **Piper TTS** (local ONNX runtime) for generating fast, natural-sounding AI speech.
    *   **💯 Scoring Agent** (`backend/scoring_agent`): Aggregates weighted scores from all other agents into a final performance report.

### **Frontend Clients**
Built with **React (Vite)** and **Tailwind CSS**.

1.  **Web Client (`/web_client`)**: The candidate-facing application.
    *   Handles Webcam/Microphone access using standard web APIs.
    *   Streams media chunks to the backend via WebSocket.
    *   Renders the AI Avatar/Interface and real-time feedback charts.
2.  **Admin Client (`/admin_client`)**:
    *   Dashboard for interviewers/admins.
    *   View candidate lists, session history, and detailed reports.
    *   Uses chart libraries for data visualization.
3.  **Website (`/website`)**:
    *   Marketing/Landing page (TypeScript version).
    *   Showcases project philosophy and features.

---

## 📂 Project Structure

```bash
finalyear/
├── backend/                # FastAPI Server & Python Agents
│   ├── agents/             # Shared agent utilities (Lazy Loaders)
│   ├── brain_agent/        # Logic & LLM Orchestrator
│   ├── verbal_agent/       # STT & Content Scoring
│   ├── non_verbal_agent/   # Video/Emotion Analysis
│   ├── vocal_agent/        # Audio Feature Extraction
│   ├── tts_agent/          # Piper TTS Engine & Models
│   ├── server.py           # Main Entry Point
│   ├── store.py            # MongoDB Database Wrapper
│   └── requirements.txt    # Python Dependencies
├── web_client/             # Candidate React App
├── admin_client/           # Admin React App
├── website/                # Landing Page
└── README.md               # This file
```

---

## ⚡ Deployment & Running Locally

### 1. Prerequisites
-   **Python 3.10+** (Recommended)
-   **Node.js 16+** & **npm**
-   **MongoDB** (Local or Atlas URIs)
-   **FFmpeg** (Must be installed and added to system PATH for audio decoding)

### 2. Environment Setup
Create a `.env` file in the `backend/` directory with the following keys:

```ini
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb://localhost:27017/ai_interview_system
# Optional email settings for report delivery
EMAIL_SENDER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Running the Backend
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\Activate
    # Mac/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Start the server:
    ```bash
    python server.py
    ```
    The server will start at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

### 4. Running the Frontend (Candidate)
1.  Open a new terminal and navigate to `web_client`:
    ```bash
    cd web_client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The app usually runs at `http://localhost:5173`.

### 5. Running the Admin Dashboard
1.  Open a new terminal and navigate to `admin_client`:
    ```bash
    cd admin_client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The app usually runs at `http://localhost:5174`.

---

## 🔄 How It Works (The Flow)

1.  **Registration**: Candidate signs up, uploading their resume. The backend parses the resume text for context.
2.  **Initialization**: User enters the interview room. A WebSocket connection is opened (`ws://localhost:8000/ws/interview`).
3.  **The Loop**:
    *   **Audio Loop**: The frontend records audio chunks -> Backend decodes via FFmpeg -> `VocalAgent` checks loudness/pitch.
    *   **Silence Detection**: When the user stops speaking (detected by `VocalAgent`), the buffered audio is sent to the `VerbalAgent` for transcription.
    *   **Visual Loop**: Video frames are captured periodically -> `NonVerbalAgent` detects face/emotions.
4.  **Response Generation**:
    *   Transcribed text is sent to the `BrainAgent` (LLM).
    *   The LLM generates a text response.
    *   `TTSAgent` converts the response to audio.
    *   Audio is streamed back to the frontend to be played.
5.  **Conclusion**:
    *   Session ends.
    *   `ScoringAgent` calculates the final score.
    *   Data is saved to MongoDB.

---
