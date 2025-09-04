import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BracketProvider } from './store/bracketStore'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BracketProvider>
      <App />
    </BracketProvider>
  </React.StrictMode>
)
