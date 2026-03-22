# CHAPTER 6.3: ALGORITHMIC FRAMEWORK AND SCORING EQUATIONS

This document details the mathematical models and algorithms used to derive the final interview performance score. The system employs a **Multi-Modal Weighted Fusion** approach, aggregating independent signals from three distinct agents: **Verbal**, **Vocal**, and **Non-Verbal**.

---

## 1. Overall Scoring Architecture

The final holistic score $S_{\text{final}}$ is a weighted linear combination of three sub-scores. The weights were determined heuristically to prioritize technical accuracy (Verbal) while still factoring in soft skills (Vocal/Non-Verbal).

$$
S_{\text{final}} = (w_1 \times S_{\text{verbal}}) + (w_2 \times S_{\text{vocal}}) + (w_3 \times S_{\text{non-verbal}})
$$

**Where:**
*   $S_{\text{verbal}}$ = Verbal Accuracy & Relevance Score (0-100)
*   $S_{\text{vocal}}$ = Vocal Confidence Score (0-100)
*   $S_{\text{non-verbal}}$ = Non-Verbal Engagement Score (0-100)
*   **Weights:**
    *   $w_1 = 0.4$ (40% - Content Quality)
    *   $w_2 = 0.3$ (30% - Vocal Delivery)
    *   $w_3 = 0.3$ (30% - Body Language)

$$
S_{\text{final}} = 0.4 S_{\text{verbal}} + 0.3 S_{\text{vocal}} + 0.3 S_{\text{non-verbal}}
$$

---

## 2. Verbal Agent (Content Analysis)

The Verbal Agent evaluates the candidate's answer based on **Semantic Similarity** to an "Ideal Answer" vector. This allows for flexible grading where the user doesn't need to match keywords exactly but must convey the correct meaning.

### 2.1 Keyword Extraction Algorithm (KeyBERT)
We first extract essential technical terms $K_{\text{user}}$ from the user's transcript $T_{\text{user}}$ and compare them against the job role keywords $K_{\text{role}}$.

$$
S_{\text{keyword}} = \frac{|K_{\text{user}} \cap K_{\text{role}}|}{|K_{\text{role}}|} \times 100
$$

### 2.2 Semantic Similarity (Transformer Model)
We use a pre-trained Transformer model (`all-MiniLM-L6-v2`) to generate dense vector embeddings for the user's spoken answer and the ideal answer.

Let:
*   $V_{\text{user}} = \text{Embed}(T_{\text{user}})$
*   $V_{\text{ideal}} = \text{Embed}(T_{\text{ideal}})$

The **Cosine Similarity** score is calculated as:

$$
\text{CosSim}(V_{\text{user}}, V_{\text{ideal}}) = \frac{V_{\text{user}} \cdot V_{\text{ideal}}}{\|V_{\text{user}}\| \times \|V_{\text{ideal}}\|}
$$

### 2.3 Final Verbal Score
The raw cosine similarity (typically -1 to 1) is normalized to a 0-100 scale, with a minimum threshold penalty for irrelevant answers.

$$
S_{\text{verbal}} = \max(0, \text{CosSim} \times 100)
$$

*(If $S_{\text{keyword}} < 20$, a penalty factor $\lambda = 0.8$ is applied to $S_{\text{verbal}}$).*

---

## 3. Vocal Agent (Paralinguistic Features)

The Vocal Agent analyzes the raw audio waveform to determine "Confidence" based on pitch stability, loudness, and speech rate.

### 3.1 Feature Extraction (Librosa)
From the audio signal $y(t)$, we extract:
1.  **Fundmental Frequency / Pitch ($F_0$)**: Using the piptrack algorithm.
2.  **Root Mean Square Energy (RMS)**: Representing loudness.
3.  **Spectral Flatness**: A measure of noise vs. tone.

### 3.2 Confidence Calculation
We define "Confidence" as having a steady volume (low standard deviation in RMS) and a stable pitch (avoiding excessive jitter or monotone).

$$
\text{Stability}_{\text{loudness}} = 1.0 - \min(1.0, \sigma_{\text{RMS}} \times \alpha)
$$

*(Where $\sigma_{\text{RMS}}$ is the standard deviation of loudness over the window, and $\alpha$ is a scaling factor).*

$$
\text{Stability}_{\text{pitch}} = 1.0 - \min(1.0, \sigma_{F_0} \times \beta)
$$

*(Where $\sigma_{F_0}$ is the standard deviation of pitch).*

The final Vocal Score $S_{\text{vocal}}$ combines these stabilities with the mean loudness (penalizing whisper-quiet speech):

$$
S_{\text{vocal}} = \left( \frac{\text{Stability}_{\text{loudness}} + \text{Stability}_{\text{pitch}}}{2} \right) \times 100
$$

---

## 4. Non-Verbal Agent (Visual Cues)

The Non-Verbal Agent analyzes video frames to detect emotions and engagement.

### 4.1 Emotion Detection (DeepFace)
For each frame $f$, the model predicts a probability distribution over 7 emotions: $P = \{p_{\text{happy}}, p_{\text{neutral}}, p_{\text{fear}}, \dots\}$.

We define a **Positive/Confident Emotion Metric** ($E_{\text{pos}}$) as the sum of "neutral" (calm) and "happy" (confident) probabilities:

$$
E_{\text{pos}} = p_{\text{neutral}} + p_{\text{happy}}
$$

### 4.2 Engagement Score
We aggregate $E_{\text{pos}}$ over $N$ frames in an answer window:

$$
S_{\text{non-verbal}} = \left( \frac{1}{N} \sum_{i=1}^{N} E_{\text{pos}}^{(i)} \right) \times 100
$$

*Penalty Logic: If "Fear" or "Sad" dominant emotions persist for >30% of frames, a penalty of -15 points is applied.*

---

## 5. Summary Table of Metrics

| Component | Input Data | Key Algorithm/Model | Output Metric | Weight |
| :--- | :--- | :--- | :--- | :--- |
| **Verbal** | Text Transcript | `all-MiniLM-L6-v2` (Transformer) | Cosine Similarity (0-1) | **40%** |
| **Vocal** | Audio Waveform | Librosa (Signal Processing) | Pitch/RMS Stability (0-1) | **30%** |
| **Non-Verbal** | Video Frames | DeepFace (CNN) | Emotion Probability (0-1) | **30%** |

---

## 6. Real-Time Logic (Pseudo-Code)

```python
def calculate_final_score(transcript, audio_data, video_frames):
    # 1. Verbal
    embedding_user = Transformer.encode(transcript)
    embedding_ideal = Transformer.encode(IDEAL_ANSWER)
    s_verbal = cosine_similarity(embedding_user, embedding_ideal) * 100

    # 2. Vocal
    pitches, rms = Librosa.extract_features(audio_data)
    s_vocal = (1 - std(pitches)) * (1 - std(rms)) * 100

    # 3. Non-Verbal
    emotions = [DeepFace.analyze(frame) for frame in video_frames]
    positive_count = sum(1 for e in emotions if e in ['neutral', 'happy'])
    s_non_verbal = (positive_count / len(frames)) * 100

    # 4. Fusion
    final_score = (0.4 * s_verbal) + (0.3 * s_vocal) + (0.3 * s_non_verbal)
    
    return round(final_score, 1)
```
