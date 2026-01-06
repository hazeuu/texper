import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";

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
