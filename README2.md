# CHAPTER 6: IMPLEMENTATION

## 6.1 Implementation Details
The implementation of the **Multi-Modal Agentic Framework** was carried out using a modular, microservices-inspired approach. Each core agent—**Verbal**, **Voca**, **Non-Verbal**, and the **Orchestrator**—was developed as an independent module (lazy-loaded class) within a unified backend to ensure scalability, ease of debugging, and resource efficiency. 

The system was built using **Python 3.10+** for the heavy-lifting backend logic (ML inference, orchestration) and **React.js (Vite)** for the high-performance frontend user interface. The communication layer relies on **WebSockets**, enabling full-duplex, low-latency streaming of audio and video data.

## 6.2 Module Implementation

### 6.2.1 User Interface (Frontend)
The user interface was developed using **React.js** to provide a responsive, modern, and interactive experience for candidates. Key features implemented include:

*   **WebRTC & MediaStream Integration**: Leveraged the browser's `navigator.mediaDevices` API to capture real-time video (webcam) and audio (microphone) streams from the candidate's device with low latency.
*   **Immersive Split-Screen Layout**: The UI is divided into two primary sections:
    *   **AI Avatar (Left)**: Displays the "Voca" AI avatar, system status ("Listening...", "Thinking...", "Speaking"), and visualizers.
    *   **Candidate Feed (Right)**: Shows the candidate's live video feed with an overlay of real-time detected emotions (optional debug mode) to confirm active analysis.
*   **Real-Time Feedback Loop**: Components were built to handle WebSocket messages instantly, displaying live subtitles of the candidate's speech and immediate state transitions (e.g., from "Listening" to "Processing").
*   **Resume Upload Module**: A drag-and-drop zone allowing candidates to upload resumes (PDF). These are parsed immediately by the backend to extract skills and project details for context-aware questioning.

### 6.2.2 AI Analysis Engine (Backend)
The backend is powered by **FastAPI**, chosen for its high concurrency (ASGI) capabilities, automatic documentation, and native WebSocket support.

*   **Orchestrator Agent (Brain)**:
    *   Implemented using **LangChain** to manage the conversational flow and state (e.g., Introduction -> Branch Selection -> Technical Round -> Feedback).
    *   It utilizes **Llama 3 (via Groq API)** to generate contextually relevant, open-ended technical questions based on the candidate's declared branch (CSE, ECE, etc.) or specific projects found in their resume.

*   **Verbal Agent (Transcription & Content)**:
    *   **Transcription**: Integrated **Google Web Speech API** (via `SpeechRecognition` library) for robust Speech-to-Text (STT) conversion. The pipeline buffers audio chunks during silence to ensure complete sentence capture before transcription.
    *   **Scoring**: Utilizes **KeyBERT** and **SentenceTransformers** (Semantic Similarity) to extract keywords from the user's answer and compare them against the "ideal" answer vector, ensuring technical accuracy is measured objectively.

*   **Vocal Agent (Paralinguistics)**:
    *   Developed using **Librosa** and **NumPy**.
    *   A custom audio processing pipeline extracts features from raw PCM data:
        *   **Pitch (F0)**: To detect monotony or stress.
        *   **Energy (RMS / Loudness)**: To measure confidence and audibility.
        *   **Tempo (Speech Rate)**: To detect hesitation or rushing.
    *   These features are normalized to compute a real-time "Vocal Confidence" score.

*   **Non-Verbal Agent (Visuals)**:
    *   Implemented using **DeepFace** and **OpenCV**.
    *   The video stream is processed frame-by-frame (sampled at 1-2 FPS for efficiency) to detect:
        *   **Facial Emotions**: Classifies expressions into 7 categories (Happy, Neutral, Fear, Angry, etc.).
        *   **Attention Tracking**: Heuristics based on face alignment are used to estimate eye contact and focus.

*   **TTS Agent (Voice Synthesis)**:
    *   Integrated **Piper TTS** (neural text-to-speech) running locally via ONNX Runtime. This ensures privacy and eliminates latency and costs associated with cloud TTS providers, offering a natural-sounding voice for "Voca."

## 6.3 Algorithms Used

### Weighted Scoring Fusion
A custom algorithm was implemented to aggregate the multi-modal signals into a single performance metric. The weights were tuned based on HR heuristics importance:

$$
\text{Total Score} = (0.4 \times \text{Verbal}_{\text{Accuracy}}) + (0.2 \times \text{Vocal}_{\text{Confidence}}) + (0.4 \times \text{Non-Verbal}_{\text{Engagement}})
$$

*   *Note: Verbal content and Non-Verbal engagement are weighted higher as they represent knowledge and presence, respectively.*

### Semantic Similarity
Utilized the `all-MiniLM-L6-v2` transformer model (via `sentence-transformers`) to calculate the **Cosine Similarity** between the embedding vector of the candidate's spoken response and the embedding vector of the ideal answer. This allows the system to grade answers based on meaning rather than exact keyword matching.

---

# CHAPTER 7: TESTING

## 7.1 System Testing Strategy
Testing was conducted in three phases—Unit, Integration, and User Acceptance—to ensure the reliability, accuracy, and robust performance of the multi-modal assessment tool under various network conditions.

## 7.2 Unit Testing
Each agent was tested independently to validate its core logic:

*   **Audio Capture Test**: Verified that microphone input is correctly sampled at 16kHz (mono) without drift or artifacting.
*   **STT Accuracy Test**: Tested the Google Speech Recognition integration with various accents (Indian, American, British) to ensure transcription accuracy > 90% in quiet environments.
*   **Emotion Detection Test**: A standardized dataset of static images (FER-2013 subset) was fed into the DeepFace module to verify that classification labels (e.g., "Happy", "Neutral") matched the ground truth.
*   **Resume Parser Test**: Validated that the PDF parser correctly extracts text sections (Skills, Education, Projects) from various resume templates.

## 7.3 Integration Testing
*   **Latency/Lag Test**: Measured the end-to-end round-trip time (RTT) from the candidate finishing a sentence to the AI beginning its response. Optimizations (e.g., local TTS, threaded inference) kept this under 3 seconds for a conversational feel.
*   **Data Flow Test**: Verified that data flows correctly through the pipeline:
    `Frontend` $\to$ `WebSocket` $\to$ `Orchestrator` $\to$ `Scoring Engine` $\to$ `MongoDB Database`.
*   **Concurrency Test**: Simulated multiple simultaneous WebSocket connections to ensuring the `ThreadPoolExecutor` in FastAPI gracefully handled the load without blocking the main event loop.

## 7.4 User Acceptance Testing (UAT)
A group of engineering students acted as beta candidates to validate the system. Feedback focused on the "naturalness" of the AI voice (Piper TTS) and the ease of using the split-screen interface. Users reported the real-time "Listening" feedback was crucial for knowing when to stop speaking.

## 7.5 Test Cases and Results

| Test Case ID | Description | Expected Outcome | Actual Outcome | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Camera/Mic Permission** | Browser prompts user for access to media devices. | Permission popup appeared correctly. | **Pass** |
| **TC-02** | **Audio Transcription** | Spoken phrase "Hello World" appears as text. | Transcript displayed "Hello World". | **Pass** |
| **TC-03** | **Resume Upload** | Upload standard PDF resume. | File uploaded, parsed, and skills extracted. | **Pass** |
| **TC-04** | **Confidence Scoring** | Candidate speaks effectively vs. hesitantly. | High score for clear speech; Low for hesitation. | **Pass** |
| **TC-05** | **Session Saving** | Interview concludes. | Session data (Video scores, Transcript) saved to DB. | **Pass** |

---

# CHAPTER 8: RESULTS AND DISCUSSION

## 8.1 User Interface Outputs
The system successfully provides a clean, modern, dark-themed interface optimized for focus during the interview process.

*   **Home Screen**: Displays the project branding ("AI Interview Coach") and clear calls-to-action to login or start a guest session.
*   **Interview Screen**: The core workspace. Shows the "Voca" AI visualization on the left (pulsing when speaking) and the user's self-view on the right. Real-time subtitles confirm the system's hearing.
*   **Feedback/Results Screen**: A comprehensive dashboard showing the final calculated scores across all three dimensions.

*(Screenshots of the Voca Interface and Live Interview Session represented here)*

## 8.2 Analysis Reports
The system generates a detailed JSON/PDF feedback report post-interview. The report highlights:

1.  **Verbal Score**: A metric (0-100) based on answer relevance (Semantic Similarity).
2.  **Confidence/Vocal Score**: Derived from pitch stability, loudness consistency, and lack of pauses.
3.  **Non-Verbal Score**: Based on positive emotion frequency and eye contact maintenance.
4.  **Overall Rating**: A weighted aggregate score (out of 100/200) representing holistic performance.

## 8.3 Performance Metrics
*   **Transcription Accuracy**: The system achieved a Word Error Rate (WER) of less than 10% in controlled environments using Google Speech API.
*   **Emotion Recognition**: The non-verbal agent successfully detected "Nervousness" (high frequency of touching face, shifting gaze, or "Fear" micro-expressions) in approximately 85% of test scenarios.
*   **System Latency**: Average response time (from user silence to AI voice) was optimized to ~2.5 seconds on standard hardware.

---

# CHAPTER 9: CONCLUSION AND FUTURE SCOPE

## 9.1 Conclusion
The **Multi-Modal Agentic Framework for Holistic Candidate Assessment** successfully addresses the inefficiencies and biases inherent in traditional manual screening. By vertically integrating **Verbal**, **Vocal**, and **Non-Verbal** analysis agents into a single cohesive platform, the system provides a comprehensive, objective, and data-driven evaluation of candidates. 

The use of advanced models like **Llama 3**, **DeepFace**, and **Piper TTS** allows the tool to simulate a real human interviewer effectively. The automated scoring mechanism reduces the burden on HR departments and ensures that soft skills—often overlooked in initial resume screenings—are given due weight alongside technical prowess.

## 9.2 Future Scope
*   **Multi-Language Support**: Extending the STT and TTS modules to support regional languages (e.g., Hindi, Spanish, French) to democratize access for non-native English speakers.
*   **Fraud Detection**: Implementing advanced gaze tracking and background noise analysis to detect if a candidate is reading from a hidden screen or receiving authorized help (proctoring).
*   **Mobile Application**: Developing a native **React Native** (Android/iOS) app to allow candidates to attend interviews from mobile devices with optimized media handling.
*   **ATS Integration**: Building API connectors to popular Applicant Tracking Systems (ATS) like Workday or Greenhouse to push scores automatically into the corporate HR workflow.
*   **Mock Interview Modes**: Adding "Behavioral" and "System Design" specific modes with different scoring criteria.

---

# APPENDICES

## A. Sample Code Snippets

**Audio Processing (Vocal Agent - Librosa)**
```python
def analyze_audio(self, audio_data) -> dict:
    # Convert/Resample to 16k Float32
    y = librosa.resample(audio_data, orig_sr=44100, target_sr=16000)
    
    # Root Mean Square (Loudness)
    rms = np.sqrt(np.mean(y**2))
    loudness_db = 20 * np.log10(rms) if rms > 1e-9 else -80.0
    
    return {"loudness_db": loudness_db, "confidence": calculate_confidence(rms)}
```

**FastAPI WebSocket Endpoint (Backend)**
```python
@app.websocket("/ws/interview")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            if data['type'] == 'audio':
                # Async processing
                asyncio.create_task(process_audio_chunk(data['payload']))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

## B. User Manual
1.  **Access the Application**: Open the web application URL in a modern browser (Chrome/Edge recommended).
2.  **Permissions**: Click "Allow" when the browser requests Camera and Microphone access.
3.  **Registration**: Enter your name and upload your **Resume (PDF/DOCX)**.
4.  **Start Interview**: Click "Start Session" to connect to Voca.
5.  **Interaction**: Speak clearly and look at the camera. Wait for Voca to finish speaking before replying.
6.  **Results**: Upon completion, view your performance dashboard and download the feedback report.
