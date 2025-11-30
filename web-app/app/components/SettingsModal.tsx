"use client";

import { useState, useEffect } from "react";
import { X, Key, Check, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { storeAPIKey, getAPIKey, clearAPIKey, hasAPIKey, APIKeyData } from "../lib/apiKeyStorage";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [provider, setProvider] = useState<'openai' | 'anthropic' | 'custom'>('openai');
  const [apiKey, setApiKey] = useState('');
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [model, setModel] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    // Check if there's a stored key
    setHasStoredKey(hasAPIKey());
    
    // Load existing key data if available
    if (isOpen) {
      loadExistingKey();
    }
  }, [isOpen]);

  const loadExistingKey = async () => {
    try {
      const keyData = await getAPIKey();
      if (keyData) {
        setProvider(keyData.provider);
        setApiKey(keyData.apiKey);
        setCustomEndpoint(keyData.endpoint || '');
        setModel(keyData.model || '');
        setHasStoredKey(true);
      }
    } catch (error) {
      console.error('Failed to load API key:', error);
    }
  };

  const handleValidateAndSave = async () => {
    if (!apiKey.trim()) {
      setValidationStatus('error');
      setValidationMessage('Please enter an API key');
      return;
    }

    console.log('Starting validation for provider:', provider);
    setIsValidating(true);
    setValidationStatus('idle');

    try {
      // Validate the API key
      console.log('Sending validation request...');
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, provider }),
      });

      console.log('Validation response status:', response.status);
      const result = await response.json();
      console.log('Validation result:', result);

      if (result.valid) {
        // Store the key securely
        console.log('Storing API key...');
        const keyData: APIKeyData = {
          provider,
          apiKey,
          endpoint: customEndpoint || undefined,
          model: model || undefined,
        };

        await storeAPIKey(keyData);
        
        setValidationStatus('success');
        setValidationMessage('API key validated and saved securely');
        setHasStoredKey(true);

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setValidationStatus('error');
        setValidationMessage(result.message || result.error || 'Invalid API key');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationStatus('error');
      setValidationMessage(`Failed to validate API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveKey = () => {
    clearAPIKey();
    setApiKey('');
    setCustomEndpoint('');
    setModel('');
    setHasStoredKey(false);
    setValidationStatus('idle');
    setValidationMessage('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-b from-cyan-500/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                    <Key className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">API Settings</h2>
                    <p className="text-xs text-white/50">Configure your LLM provider</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  LLM Provider
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['openai', 'anthropic', 'custom'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setProvider(p)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                        provider === p
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key Input */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`Enter your ${provider} API key`}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition pr-10"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Custom Endpoint (only for custom provider) */}
              {provider === 'custom' && (
                <>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">
                      API Endpoint
                    </label>
                    <input
                      type="text"
                      value={customEndpoint}
                      onChange={(e) => setCustomEndpoint(e.target.value)}
                      placeholder="https://api.example.com/v1/chat"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">
                      Model Name (optional)
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g., gpt-4, claude-3-opus"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition"
                    />
                  </div>
                </>
              )}

              {/* Validation Status */}
              <AnimatePresence>
                {validationStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-3 rounded-lg flex items-center gap-2 ${
                      validationStatus === 'success'
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-red-500/10 border border-red-500/30'
                    }`}
                  >
                    {validationStatus === 'success' ? (
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                    <p
                      className={`text-sm ${
                        validationStatus === 'success' ? 'text-green-300' : 'text-red-300'
                      }`}
                    >
                      {validationMessage}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Security Notice */}
              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3">
                <p className="text-xs text-cyan-300/70">
                  🔒 Your API key is encrypted using AES-256-GCM and stored locally in your browser. It never leaves your device.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/40 flex gap-3">
              {hasStoredKey && (
                <button
                  onClick={handleRemoveKey}
                  className="flex-1 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-medium transition"
                >
                  Remove Key
                </button>
              )}
              <button
                onClick={handleValidateAndSave}
                disabled={isValidating || !apiKey.trim()}
                className="flex-1 py-3 px-4 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate & Save'
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
