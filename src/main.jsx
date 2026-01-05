import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import App from './App.jsx'
import './index.css'
import { AuthProvider } from './pages/internal/jsx/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/texper">
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
