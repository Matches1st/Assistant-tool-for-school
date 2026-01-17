import React, { useState } from 'react';
import { ArrowRight, Key, Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { testApiKey } from '../lib/gemini';

interface LandingPageProps {
  onSaveKey: (key: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSaveKey }) => {
  const [key, setKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTestKey = async () => {
    if (!key.trim()) return;
    
    setIsTesting(true);
    setTestStatus('idle');
    setErrorMessage('');

    try {
      await testApiKey(key.trim());
      setTestStatus('success');
    } catch (error: any) {
      setTestStatus('error');
      console.error("Test failed", error);
      
      let msg = "Invalid API key or network error.";
      if (error.message) {
        if (error.message.includes('403')) {
          msg = "Access denied. Please ensure your API key has NO HTTP referrer restrictions (or allows this domain) in Google AI Studio.";
        } else if (error.message.includes('400')) {
          msg = "Invalid key format or project configuration.";
        } else if (error.message.includes('429')) {
          msg = "Quota exceeded. This key has reached its daily limit.";
        }
      }
      setErrorMessage(msg);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSaveKey(key.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gemini-dark text-gemini-text flex flex-col items-center justify-center px-4 relative overflow-hidden overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>

      <div className="max-w-md w-full z-10 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-6 border border-white/5">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-4xl font-semibold mb-3">Welcome to Gemini</h1>
          <p className="text-gray-400">To get started, please enter your Gemini API key.</p>
        </div>

        {/* Rate Limit Warning */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4 text-sm text-blue-200">
          <div className="flex gap-2 items-start">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium">Upgraded to Gemini 2.5 Flash</p>
              <p className="opacity-90 leading-relaxed">
                We have switched to <strong>gemini-2.5-flash</strong> for better performance. 
              </p>
              <ul className="list-disc pl-4 opacity-80 space-y-1 mt-1">
                 <li>~500 free requests/day (Free Tier)</li>
                 <li>Supports images, audio, and search grounding</li>
                 <li>Enable <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Pay-as-you-go</a> for higher limits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Restriction Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6 text-sm text-yellow-200">
          <div className="flex gap-2 items-start">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Deployment Requirement:</strong> Your API key must have <u>NO HTTP referrer restrictions</u> (or allow <code>*.netlify.app</code>). Keys are stored locally in your browser.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setTestStatus('idle');
                setErrorMessage('');
              }}
              placeholder="Enter your Gemini API key"
              className={`w-full bg-gemini-gray border rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                testStatus === 'error' ? 'border-red-500/50' : 
                testStatus === 'success' ? 'border-green-500/50' : 
                'border-gray-700'
              }`}
              required
            />
          </div>

          {testStatus === 'error' && (
            <div className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 p-3 rounded-lg">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}

          {testStatus === 'success' && (
            <div className="text-green-400 text-sm flex items-center gap-2 bg-green-500/10 p-3 rounded-lg">
              <CheckCircle size={16} />
              API Key validated successfully!
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={!key.trim() || isTesting}
              className="w-full bg-gemini-gray border border-gray-600 text-white font-medium py-3.5 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTesting ? <Loader2 className="animate-spin" size={18} /> : 'Test Key'}
            </button>
            <button
              type="submit"
              disabled={!key.trim() || isTesting || testStatus === 'error'}
              className="w-full bg-white text-gemini-dark font-medium py-3.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Chatting <ArrowRight size={18} />
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
          >
            Get your free Gemini API key here
            <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;