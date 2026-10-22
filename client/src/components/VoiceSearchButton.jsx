import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceSearchButton({ onTranscript, lang = 'en' }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.interimResults = false;

    
    recognizer.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';

    recognizer.onstart = () => {
      setIsListening(true);
    };

    recognizer.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      if (speechToText && onTranscript) {
        onTranscript(speechToText);
      }
    };

    recognizer.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognizer.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognizer);
  }, [lang]);

  if (!supported) return null;

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
        recognition.start();
      } catch (err) {
        console.warn('Speech recognition already started or blocked.');
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2 rounded-lg transition flex items-center justify-center ${
        isListening
          ? 'bg-red-500 text-white animate-pulse shadow-md'
          : 'text-slate-400 hover:text-amber-400 hover:bg-slate-700/50'
      }`}
      title={
        isListening
          ? lang === 'ta'
            ? 'கேட்கிறது... பேசுங்கள்'
            : 'Listening... speak now'
          : lang === 'ta'
          ? 'குரல் மூலம் தேட (Voice Search)'
          : 'Voice Search'
      }
    >
      {isListening ? (
        <MicOff className="w-4 h-4 text-white" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}