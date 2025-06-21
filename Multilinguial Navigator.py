from flask import Flask, render_template, request, jsonify
from googletrans import Translator, LANGUAGES
from gtts import gTTS
import os
import speech_recognition as sr

# Optional: for noise reduction
import numpy as np
import noisereduce as nr

app = Flask(__name__)
translator = Translator()

# Ensure the static directory exists for saving audio files
os.makedirs("static", exist_ok=True)

@app.route('/')
def home():
    languages = {name.capitalize(): code for code, name in LANGUAGES.items()}
    return render_template('index.html', languages=languages)

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    text = data.get('text', '')
    source_lang = data.get('source', 'auto')
    target_lang = data.get('target', 'en')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        translated_text = translator.translate(text, src=source_lang, dest=target_lang).text

        audio_path = "static/output.mp3"
        tts = gTTS(text=translated_text, lang=target_lang)
        tts.save(audio_path)

        return jsonify({'translated_text': translated_text, 'audio_url': '/' + audio_path})

    except Exception as e:
        return jsonify({'error': f"Translation or TTS error: {str(e)}"}), 500

@app.route('/voice_input', methods=['POST'])
def voice_input():
    recognizer = sr.Recognizer()
    recognizer.energy_threshold = 300
    recognizer.dynamic_energy_threshold = True
    recognizer.pause_threshold = 0.8
    recognizer.operation_timeout = 10

    # Allow frontend to set recognition language (default to en-US)
    lang_code = request.args.get('lang', 'en-US')

    try:
        with sr.Microphone(sample_rate=16000) as source:
            print("Adjusting for background noise...")
            recognizer.adjust_for_ambient_noise(source, duration=2)

            print("Listening...")
            audio = recognizer.listen(source, timeout=15, phrase_time_limit=30)

            # Save for debugging
            with open("static/input.wav", "wb") as f:
                f.write(audio.get_wav_data())

            # Optional: Apply noise reduction (requires noisereduce & numpy)
            raw_audio = np.frombuffer(audio.get_raw_data(), np.int16)
            reduced_noise = nr.reduce_noise(y=raw_audio, sr=16000)
            audio = sr.AudioData(reduced_noise.tobytes(), 16000, 2)

            print("Processing speech...")
            text = recognizer.recognize_google(audio, language=lang_code)
            print("Recognized:", text)

            return jsonify({'text': text})

    except sr.UnknownValueError:
        return jsonify({'error': 'Could not understand the audio. Try speaking clearly.'}), 400
    except sr.RequestError:
        return jsonify({'error': 'Speech Recognition service unavailable. Please try again later.'}), 500
    except Exception as e:
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
