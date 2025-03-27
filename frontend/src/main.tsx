import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './0_app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
