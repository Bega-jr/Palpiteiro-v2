import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // ← Já tá importando, perfeito

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)