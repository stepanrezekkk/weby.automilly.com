import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppV2 from './AppV2.jsx'

// Toggle between V1 and V2:
const USE_V2 = true

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {USE_V2 ? <AppV2 /> : <App />}
  </StrictMode>,
)
