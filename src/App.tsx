import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { AppErrorBoundary } from './app/errors/AppErrorBoundary'

function App() {
  return (
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  )
}

export default App
