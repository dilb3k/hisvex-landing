import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './style.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/top" element={<App />} />
        <Route path="/imkoniyatlar" element={<App />} />
        <Route path="/ekranlar" element={<App />} />
        <Route path="/narxlar" element={<App />} />
        <Route path="/privacy" element={<App />} />
        <Route path="/faq" element={<App />} />
        <Route path="/terms" element={<App />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
