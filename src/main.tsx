import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
// Ловим beforeinstallprompt до первого рендера — событие может прийти очень рано
import './lib/pwa/installPrompt'
import { registerServiceWorker } from './lib/pwa/registerServiceWorker'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { ensureStorageSchema } from './lib/storage'

// До первого рендера: данные несовместимой версии прототипа сбрасываются
ensureStorageSchema()
registerServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
