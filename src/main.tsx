import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { SettingsProvider } from './lib/settings'
import { enableOffline } from './lib/pwa'
import './index.css'
import './styles/app.css'
import './styles/seal.css'

// Service Worker nur registrieren, wenn der Offline-Modus in den Einstellungen
// nicht ausgeschaltet wurde (Default: an).
try {
  const raw = localStorage.getItem('bibliothek:settings')
  const offline = raw ? (JSON.parse(raw).offline ?? true) : true
  if (offline) enableOffline()
} catch {
  enableOffline()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </SettingsProvider>
  </React.StrictMode>,
)
