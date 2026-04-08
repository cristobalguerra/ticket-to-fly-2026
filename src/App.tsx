import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Vote from './pages/Vote'
import Upload from './pages/Upload'
import Admin from './pages/Admin'
import Ceremony from './pages/Ceremony'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/ceremony" element={<Ceremony />} />
      </Routes>
    </HashRouter>
  )
}
