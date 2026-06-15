import { Routes, Route } from 'react-router-dom'
import Bibliothek from './pages/Bibliothek'
import ModulePage from './pages/ModulePage'
import SealPage from './pages/SealPage'
import GirihField from './components/GirihField'

export default function App() {
  return (
    <>
      <div className="atmosphere" aria-hidden />
      <GirihField />
      <Routes>
        <Route path="/" element={<Bibliothek />} />
        <Route path="/modul/:moduleId" element={<ModulePage />} />
        <Route path="/modul/:moduleId/siegel/:sealId" element={<SealPage />} />
        <Route path="*" element={<Bibliothek />} />
      </Routes>
    </>
  )
}
