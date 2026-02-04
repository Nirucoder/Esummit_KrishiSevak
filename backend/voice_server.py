from flask import Flask, request, jsonify
from flask_cors import CORS
import pyttsx3
import speech_recognition as sr
import threading
import pythoncom
import os
import tempfile
import time

# Try to import PyAudio dependencies for fallback
try:
    import sounddevice as sd
    import scipy.io.wavfile as wav
    import numpy as np
    HAS_SOUNDDEVICE = True
except ImportError:
    HAS_SOUNDDEVICE = False

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Speech Recognizer
recognizer = sr.Recognizer()

def speak_text(text):
    """
    Function to speak text using pyttsx3.
    Must be run in a separate thread to avoid blocking Flask,
    and needs pythoncom.CoInitialize() for Windows COM compatibility in threads.
    """
    try:
        pythoncom.CoInitialize()
        engine = pyttsx3.init()
        engine.setProperty('rate', 150)  # Speed of speech
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"TTS Error: {e}")
    finally:
        pythoncom.CoUninitialize()

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "online", "message": "Voice server is running"})

@app.route('/speak', methods=['POST'])
def speak():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"success": False, "error": "No text provided"}), 400
    
    print(f"Speaking: {text}")
    # Run in a separate thread so it doesn't block the response
    thread = threading.Thread(target=speak_text, args=(text,))
    thread.start()
    
    return jsonify({"success": True, "message": "Speaking started"})

@app.route('/listen', methods=['POST'])
def listen():
    """
    Listens via usage of the server's microphone.
    Tries PyAudio first (sr.Microphone), falls back to sounddevice.
    """
    try:
        # 1. Try PyAudio (Standard SpeechRecognition)
        try:
            with sr.Microphone() as source:
                print("Adjusting for ambient noise (PyAudio)...")
                recognizer.adjust_for_ambient_noise(source, duration=0.5)
                print("Listening (PyAudio)...")
                
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
                print("Processing audio...")
                
                text = recognizer.recognize_google(audio)
                print(f"Recognized: {text}")
                return jsonify({"success": True, "text": text})
                
        except (OSError, AttributeError) as e:
            # OSError is raised if no PyAudio or no Refault Input Device
            print(f"PyAudio failed ({e}), trying sounddevice fallback...")
            
            if not HAS_SOUNDDEVICE:
                return jsonify({"success": False, "error": "Microphone not available (PyAudio missing, SoundDevice missing)"}), 500

            # 2. Fallback: SoundDevice
            fs = 44100  # Sample rate
            seconds = 5  # Duration of recording
            
            print("Listening (SoundDevice fallback, 5s fixed)...")
            recording = sd.rec(int(seconds * fs), samplerate=fs, channels=1)
            sd.wait()  # Wait until recording is finished
            print("Recording finished.")
            
            # Save to temporary file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_wav:
                temp_filename = temp_wav.name
                
            # Convert float32 to int16 for WAV compatibility if needed, or let scipy handle it
            # Standard WAV for SpeechRecognition works best with int16 PCM
            recording_int16 = (recording * 32767).astype(np.int16)
            wav.write(temp_filename, fs, recording_int16)
            
            # Read back using SpeechRecognition
            with sr.AudioFile(temp_filename) as source:
                audio = recognizer.record(source)
                
            # Clean up temp file
            try:
                os.remove(temp_filename)
            except:
                pass
                
            print("Processing audio (fallback)...")
            text = recognizer.recognize_google(audio)
            print(f"Recognized: {text}")
            return jsonify({"success": True, "text": text})

    except sr.WaitTimeoutError:
        return jsonify({"success": False, "error": "No speech detected (timeout)"}), 408
    except sr.UnknownValueError:
        return jsonify({"success": False, "error": "Could not understand audio"}), 400
    except sr.RequestError as e:
        return jsonify({"success": False, "error": f"Speech API error: {e}"}), 503
    except Exception as e:
        print(f"STT Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("Starting KrishiSevak Voice Server on port 5000...")
    app.run(port=5000, debug=True)
