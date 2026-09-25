import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import AdminPanel from './admin/AdminPanel'
import './index.css'

const RoundPage = lazy(() => import('./pages/RoundPage'))
const DragonPage = lazy(() => import('./pages/DragonPage'))

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="/round/:id"
          element={
            <Suspense fallback={null}>
              <RoundPage />
            </Suspense>
          }
        />
        <Route
          path="/round/2/dragon"
          element={
            <Suspense fallback={null}>
              <DragonPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
