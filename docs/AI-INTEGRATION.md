# AI Integration Guide

## Current State

The AI matching features are designed but not yet connected to IBM Watson. 
The `AssistantPlaceholder` component at `src/components/ai/AssistantPlaceholder.jsx` 
shows users what features are coming.

A keyword + category matching algorithm is implemented in 
`src/services/items/matchingService.js` as a stopgap.

## Planned IBM Watson Integration

### Watson Assistant
- Conversational interface for users to describe lost items
- Smart form auto-fill from natural language descriptions
- FAQ bot for campus policies

### Watson Natural Language Understanding (NLU)
- Extract item attributes (brand, color, type) from free-text descriptions
- Improve match scoring with semantic similarity

### Watson Visual Recognition
- Compare uploaded item photos for visual similarity
- Augment text-based matching with image analysis

## Integration Steps (When Ready)

### 1. Add Environment Variables
```
VITE_IBM_ASSISTANT_ID=your-assistant-id
VITE_IBM_ASSISTANT_REGION=us-south
```

### 2. Install SDK
```bash
npm install ibm-watson
```

### 3. Create Watson Service
```js
// src/services/ai/watsonService.js
import AssistantV2 from 'ibm-watson/assistant/v2'
import { IamAuthenticator } from 'ibm-watson/auth'

const assistant = new AssistantV2({
  version: '2021-11-27',
  authenticator: new IamAuthenticator({ apikey: process.env.IBM_WATSON_API_KEY }),
  serviceUrl: `https://api.${import.meta.env.VITE_IBM_ASSISTANT_REGION}.assistant.watson.cloud.ibm.com`,
})
```

> **Note**: IBM Watson API keys must be kept server-side. Use Supabase Edge Functions 
> to proxy Watson API calls from the frontend.

### 4. Replace Placeholder Component
Replace `AssistantPlaceholder.jsx` with a live chat widget using the Watson Web Chat SDK.

## Matching Algorithm (Current)

The current keyword-based algorithm (`matchingService.js`) scores matches as:
- **Category match**: 40 points
- **Color match**: 20 points  
- **Keyword overlap** (title + description): up to 40 points

Items scoring > 40 are surfaced as potential matches.
