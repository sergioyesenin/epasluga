import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'

// Временно отключаем MSW для продакшена
// async function enableMocking() {
//   if (import.meta.env.DEV) {
//     const { worker } = await import('./lib/api/mocks/browser')
//     await worker.start()
//   }
// }

// enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
// })