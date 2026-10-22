import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, X, Send, Bot, Phone, MessageCircle } from 'lucide-react';

const SUGGESTIONS = [
  '⚡ Electrician in Kattuparamakudi',
  '🔧 Plumber near me',
  '🚗 Acting Driver',
  '🚌 Paramakudi Bus Stand enquiry',
  '🏠 2 BHK House for rent',
];

export default function AiSearchModal({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const runAiSearch = async (queryText) => {
    const query = queryText || prompt;
    if (!query.trim()) return;

    setLoading(true);
    setResponse('');
    try {
      const res = await axios.post('https://namma-paramakudi-api.vercel.app/api/ai-search', { prompt: query });
      setResponse(res.data.answer);
    } catch (err) {
      setResponse('Sorry, unable to get an answer right now. Please verify your backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runAiSearch();
  };

  const handleChipClick = (chipText) => {
    // Strip leading emoji for clean prompt
    const cleaned = chipText.replace(/^[\p{Emoji}\s]+/u, '').trim();
    setPrompt(cleaned);
    runAiSearch(cleaned);
  };

  // Extract phone number from response if present
  const phoneMatch = response ? response.match(/\b\d{10}\b/) : null;
  const phoneNumber = phoneMatch ? phoneMatch[0] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Paramakudi AI Helper</h2>
            <p className="text-xs text-slate-500">Ask anything in English or Tanglish</p>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((chip, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="text-xs bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200/80 transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Need an electrician in Kattuparamakudi..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border border-slate-300 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute right-2 top-2 bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl flex items-center gap-3 text-slate-600 text-sm animate-pulse border border-slate-200/60">
            <Bot className="w-5 h-5 text-amber-500 animate-spin flex-shrink-0" />
            Searching Paramakudi directory...
          </div>
        )}

        {/* Response Display with Action Buttons */}
        {response && !loading && (
          <div className="mt-4 p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-slate-800 text-sm leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1.5">
              <Bot className="w-4 h-4 text-amber-600" /> Recommendation:
            </div>
            <p className="whitespace-pre-line text-slate-700">{response}</p>

            {/* Quick Contact Buttons */}
            {phoneNumber && (
              <div className="mt-3 pt-3 border-t border-amber-200/70 flex items-center gap-2">
                <a
                  href={`tel:${phoneNumber}`}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
                >
                  <Phone className="w-3.5 h-3.5" /> Call ({phoneNumber})
                </a>
                <a
                  href={`https://wa.me/91${phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}