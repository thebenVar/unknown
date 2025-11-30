# 🔐 API Key Management - Security Documentation

## Overview

Skhoolar implements industry-standard security practices for storing and handling user-provided LLM API keys. This document outlines the security measures in place.

## Security Architecture

### 1. **Client-Side Encryption (AES-256-GCM)**

- API keys are encrypted using **AES-256-GCM** (Advanced Encryption Standard with Galois/Counter Mode)
- Encryption happens entirely in the browser using the Web Crypto API
- Each encryption uses a unique random Initialization Vector (IV)
- Keys never leave the user's device in plaintext

### 2. **Encryption Key Storage**

- The encryption key itself is stored in **IndexedDB** (more secure than localStorage)
- The encryption key is generated once per browser and reused for all encryptions
- Uses the browser's native crypto.subtle API for cryptographic operations

### 3. **Key Validation**

- Before storing, API keys are validated against the provider's API
- Validation happens server-side to prevent exposing keys in client-side code
- Failed validations prevent storage of invalid keys

### 4. **Zero-Knowledge Architecture**

- The server **never stores** user API keys
- API keys are sent from client to server only for the duration of a single request
- Each chat request includes the encrypted key (decrypted client-side, sent over HTTPS)

### 5. **HTTPS Only**

- All API communications happen over HTTPS
- API keys are never transmitted over unencrypted connections

## Implementation Details

### File Structure

```
web-app/
├── app/
│   ├── lib/
│   │   └── apiKeyStorage.ts          # Client-side encryption/decryption
│   ├── api/
│   │   ├── chat/route.ts             # Chat endpoint (uses API key)
│   │   └── validate-key/route.ts     # Key validation endpoint
│   └── components/
│       └── SettingsModal.tsx         # UI for key management
└── .env.local.example                # Environment template
```

### Storage Layers

1. **IndexedDB**: Stores the AES encryption key
2. **localStorage**: Stores the encrypted API key data
3. **Memory**: Decrypted keys exist only temporarily during API calls

### Encryption Flow

```
User Input → AES-256-GCM Encryption → localStorage (encrypted)
                     ↓
              IndexedDB (encryption key)
```

### Decryption Flow

```
localStorage (encrypted) → Retrieve encryption key from IndexedDB
                     ↓
              AES-256-GCM Decryption → Memory (temporary)
                     ↓
              HTTPS Request to LLM API → Cleared from memory
```

## Supported Providers

- **OpenAI** (GPT models)
- **Gemini** (Google Gemini models)
- **Custom** (any OpenAI-compatible API)

## User Privacy

### What we DON'T do:
❌ Store API keys on our servers  
❌ Log API keys  
❌ Transmit keys to third parties (except the chosen LLM provider)  
❌ Share keys between devices  

### What we DO:
✅ Encrypt keys using industry-standard AES-256-GCM  
✅ Store keys only in the user's browser  
✅ Allow users to delete keys at any time  
✅ Validate keys before storage  
✅ Use HTTPS for all communications  

## Browser Compatibility

The encryption system requires:
- **Web Crypto API** (supported in all modern browsers)
- **IndexedDB** (supported in all modern browsers)
- **localStorage** (supported in all modern browsers)

Supported browsers:
- Chrome/Edge 60+
- Firefox 57+
- Safari 11+

## Best Practices for Users

1. **Use API Keys with Limited Scope**
   - If your provider supports it, create keys with minimal permissions
   - For OpenAI, consider using keys with spending limits

2. **Rotate Keys Regularly**
   - Periodically update your API keys
   - Use the "Remove Key" button to clear old keys

3. **Monitor Usage**
   - Check your LLM provider dashboard for unexpected usage
   - Revoke keys immediately if suspicious activity is detected

4. **Browser Security**
   - Keep your browser updated
   - Use browser-level encryption (BitLocker, FileVault)
   - Don't use Skhoolar on shared/public computers with your API key

## Technical Security Measures

### 1. XSS Protection
- Next.js automatic escaping prevents script injection
- Content Security Policy headers (can be configured)

### 2. CORS Protection
- API routes validate request origins
- Prevents unauthorized cross-origin requests

### 3. Rate Limiting (Recommended)
- Implement rate limiting on your LLM API keys
- Set spending limits with your provider

### 4. Key Derivation
- Uses PBKDF2-like security through Web Crypto API
- Random IV for each encryption operation

## Development Guidelines

### For Contributors

When working with the API key system:

1. **Never log API keys** - even in development
2. **Use environment variables** for server-side keys (if any)
3. **Test with dummy keys** - never commit real keys
4. **Validate input** - sanitize all user inputs
5. **Use HTTPS** - even in development (when possible)

### Testing

```bash
# Test key validation
curl -X POST http://localhost:3000/api/validate-key \
  -H "Content-Type: application/json" \
  -d '{"apiKey":"test-key","provider":"openai"}'

# Test encryption (browser console)
import { storeAPIKey, getAPIKey } from './app/lib/apiKeyStorage';
await storeAPIKey({ provider: 'openai', apiKey: 'test' });
const key = await getAPIKey();
console.log(key);
```

## Compliance

This implementation follows:
- **OWASP** security guidelines for client-side storage
- **GDPR** principles (data minimization, user control)
- **SOC 2** encryption standards (AES-256)

## Future Improvements

Potential enhancements:
- [ ] Master password for additional encryption layer
- [ ] Key expiration/rotation reminders
- [ ] Biometric authentication support
- [ ] Hardware security module (HSM) integration
- [ ] Multi-device sync (with end-to-end encryption)

## Questions?

For security concerns or questions, please open an issue on GitHub.

---

**Last Updated**: November 30, 2025  
**Security Level**: Production-Ready ✅
