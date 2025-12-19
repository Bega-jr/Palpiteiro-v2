// src/lib/config.ts
export const BACKEND_URL = import.meta.env.PROD 
  ? 'https://palpiteiro-v2-backend.vercel.app' 
  : 'http://localhost:5000'
