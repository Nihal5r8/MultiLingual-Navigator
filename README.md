🌍 Multilingual Navigator
Real-Time Voice-to-Voice Translation & Speech Intelligence Platform

Multilingual Navigator is a Python-based web application that enables real-time speech recognition, multilingual translation, and instant voice playback. Designed as a research-driven prototype, the system captures spoken language, cleans the audio signal, translates the content into a target language, and responds with natural-sounding speech—all within a seamless web interface.

This project explores how speech intelligence and translation pipelines can be combined to reduce language barriers in real-world interactions.

🚀 Key Features
🎙️ Intelligent Speech Recognition

High-sensitivity microphone input using SpeechRecognition

Adjustable energy thresholds for different acoustic environments

Ambient noise calibration before capture

🌐 Multilingual Translation

Supports 100+ languages via Google Translate (googletrans)

Automatic source-language detection

Near real-time text translation

🔊 Text-to-Speech Playback

Generates natural-sounding speech using gTTS

Accent-aware pronunciation based on target language

Instant audio playback of translated output

🎧 Advanced Audio Processing

Noise reduction using noisereduce and numpy

Filters background hums and static for improved recognition accuracy

Optional toggle for low-latency performance

⚡ Real-Time Web Interaction

Flask-based backend with AJAX-style communication

No page reloads during speech capture or translation

Lightweight and responsive UI

🧠 Technical Workflow

The application processes user input through the following pipeline:

Capture
sr.Microphone records raw audio from the user

Clean
noisereduce removes stationary background noise

Recognize
Google Web Speech API converts cleaned audio → text

Translate
Google Translate engine converts text → target language

Synthesize
gTTS generates an .mp3 audio response for playback

🛠️ Technology Stack
Layer	Technology
Backend	Python, Flask
Speech-to-Text	SpeechRecognition (Google Web Speech API)
Translation	googletrans
Text-to-Speech	gTTS
Audio Processing	noisereduce, numpy
Frontend	HTML, CSS, JavaScript
Audio I/O	PyAudio
📋 Prerequisites

Before running the project, ensure you have:

Python 3.8+

A working microphone

PyAudio installed (required for live audio capture)

PyAudio Installation Notes

Windows:

pip install pipwin
pipwin install pyaudio


macOS:

brew install portaudio
pip install pyaudio

⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/yourusername/multilingual-navigator.git
cd multilingual-navigator

2. Create a Virtual Environment (Recommended)
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

3. Install Dependencies
pip install flask googletrans==4.0.0-rc1 gTTS SpeechRecognition noisereduce numpy pyaudio

🏃 Running the Application

Start the Flask server:

python app.py


Open your browser and navigate to:

http://127.0.0.1:5000

🧭 How to Use

Select your target language

Click the microphone button

Speak clearly (the system calibrates ambient noise for ~2 seconds)

The app:

Transcribes your speech

Translates it

Plays the translated audio automatically

📂 Project Structure
├── app.py                     # Core Flask backend logic
├── static/
│   ├── input.wav              # Recorded microphone input
│   ├── output.mp3             # Generated translated audio
│   ├── styles.css
│   └── script.js
├── templates/
│   └── index.html             # Frontend UI
└── README.md

⚠️ Troubleshooting
🎤 Microphone Not Detected

Ensure no other application is using the microphone

Adjust recognizer.energy_threshold in app.py

🌐 Translation Limits

googletrans is an unofficial API wrapper

Excessive requests may trigger temporary rate limits

⏱️ Audio Latency

Noise reduction adds minor processing delay

Disable noisereduce for faster (but noisier) performance

🧪 Research Notes & Limitations

Designed as a research and learning project

Not intended for production-scale deployment

API behavior may change due to reliance on unofficial Google endpoints

📝 License

This project is released under the MIT License.
