import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, Volume2, VolumeX, MicOff } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Vue de discussion avec l'assistant intelligent StadeVoice
 * Inclut la reconnaissance vocale (Speech-to-Text) et la synthèse vocale (Text-to-Speech)
 */
const AssistantView = () => {
  const { language, setLanguage, t } = useLanguage();

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: t('assistant_welcome'),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const languages = ['FR', 'EN', 'ES', 'AR', 'PT'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Si l'historique ne contient que le message d'accueil initial, mettre à jour le message d'accueil lors du changement de langue
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 1) {
        return [{ id: 1, role: 'assistant', content: t('assistant_welcome') }];
      }
      return prev;
    });
  }, [language, t]);

  // Nettoyer la synthèse vocale lors du démontage
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Déclencher la reconnaissance vocale native du navigateur
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas disponible sur ce navigateur. Veuillez utiliser Chrome ou Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langCodes = {
        FR: 'fr-FR',
        EN: 'en-US',
        ES: 'es-ES',
        AR: 'ar-MA',
        PT: 'pt-PT',
      };
      recognition.lang = langCodes[language] || 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Erreur reconnaissance vocale:', err);
      setIsListening(false);
    }
  };

  // Lire la réponse de l'assistant à voix haute (Synthèse vocale)
  const speakText = (id, text) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langCodes = {
      FR: 'fr-FR',
      EN: 'en-US',
      ES: 'es-ES',
      AR: 'ar-SA',
      PT: 'pt-PT',
    };
    utterance.lang = langCodes[language] || 'fr-FR';
    utterance.rate = 1.0;
    
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    
    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, language }),
      });
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'assistant', content: data.answer || data.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'assistant', content: t('assistant_error') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-fade-in">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-4 shadow-md sticky top-0 z-10 flex flex-col gap-3 rounded-b-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bot size={24} className="text-white" />
          </div>
          <h2 className="text-white font-semibold text-lg">{t('assistant_title')}</h2>
        </div>
        
        {/* Sélecteur de langue synchronisé avec le LanguageContext */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all min-h-9 ${
                language === lang
                  ? 'bg-white text-emerald-700 shadow-sm scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2 rtl:mr-0 rtl:ml-2 flex-shrink-0 mt-1">
                <Bot size={16} className="text-emerald-600" />
              </div>
            )}
            <div className="max-w-[85%] flex flex-col">
              <div
                className={`rounded-2xl p-4 shadow-sm relative ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-sm rtl:rounded-tr-2xl rtl:rounded-tl-sm'
                    : 'bg-white text-gray-800 rounded-tl-sm rtl:rounded-tl-2xl rtl:rounded-tr-sm border border-gray-100'
                }`}
              >
                <p className="text-[15px] leading-relaxed">{msg.content}</p>

                {/* Bouton de synthèse vocale pour écouter la réponse */}
                {msg.role === 'assistant' && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => speakText(msg.id, msg.content)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                        speakingMessageId === msg.id
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : 'text-gray-400 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                      aria-label="Écouter la réponse"
                    >
                      {speakingMessageId === msg.id ? (
                        <>
                          <VolumeX size={14} className="animate-pulse" />
                          <span>{t('stop_speaking')}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} />
                          <span>{t('speak_response')}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2 rtl:mr-0 rtl:ml-2 flex-shrink-0">
              <Bot size={16} className="text-emerald-600" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex gap-1 items-center h-[52px]">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bannière active lors de la reconnaissance vocale */}
      {isListening && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-700 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-xs font-bold">{t('listening')}</span>
          </div>
          <button
            type="button"
            onClick={toggleListening}
            className="text-xs bg-red-600 text-white font-semibold px-2.5 py-1 rounded-full shadow-sm"
          >
            {t('stop_speaking')}
          </button>
        </div>
      )}

      {/* Zone de saisie */}
      <div className="p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-2xl mt-auto">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className={`flex-1 min-h-12 bg-gray-100 rounded-full flex items-center px-4 border transition-all ${
            isListening ? 'border-red-500 bg-red-50/30' : 'border-transparent focus-within:border-emerald-500 focus-within:bg-white'
          }`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? t('listening') : t('assistant_placeholder')}
              className="flex-1 bg-transparent border-none outline-none text-[15px] py-2"
            />
            {/* Bouton Microphone avec reconnaissance vocale native */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 min-h-10 min-w-10 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'text-white bg-red-500 shadow-md animate-pulse'
                  : 'text-gray-400 hover:text-emerald-600'
              }`}
              aria-label={t('assistant_mic_label')}
              title={t('assistant_mic_label')}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md disabled:bg-gray-300 disabled:shadow-none transition-colors active:scale-95 flex-shrink-0"
            aria-label="Envoyer"
          >
            <Send size={20} className="rtl:rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssistantView;
