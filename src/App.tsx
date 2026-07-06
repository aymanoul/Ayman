import { Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Bibliothek from './pages/Bibliothek'
import ModulePage from './pages/ModulePage'
import SealPage from './pages/SealPage'
import Regal from './pages/Regal'
import Einstellungen from './pages/Einstellungen'
import Favoriten from './pages/Favoriten'
import Notizen from './pages/Notizen'
import Verlauf from './pages/Verlauf'
import Ueber from './pages/Ueber'
import AppChrome from './components/AppChrome'
import { BelegProvider } from './components/Beleg'
import { useSettings } from './lib/settings'

export default function App() {
  const { settings } = useSettings()
  return (
    <MotionConfig reducedMotion={settings.reduceMotion ? 'always' : 'user'}>
      <BelegProvider>
        <div className="atmosphere" aria-hidden />
        <AppChrome />
        <Routes>
          <Route path="/" element={<Bibliothek />} />
          <Route path="/regal" element={<Regal />} />
          <Route path="/modul/:moduleId" element={<ModulePage />} />
          <Route path="/modul/:moduleId/buch/:sealId" element={<SealPage />} />
          {/* Alias: alte /siegel/-Links bleiben gueltig */}
          <Route path="/modul/:moduleId/siegel/:sealId" element={<SealPage />} />
          <Route path="/einstellungen" element={<Einstellungen />} />
          <Route path="/favoriten" element={<Favoriten />} />
          <Route path="/notizen" element={<Notizen />} />
          <Route path="/verlauf" element={<Verlauf />} />
          <Route path="/ueber" element={<Ueber />} />
          <Route path="*" element={<Bibliothek />} />
        </Routes>
      </BelegProvider>
    </MotionConfig>
  )
}
