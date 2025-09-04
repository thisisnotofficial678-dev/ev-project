import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { IntroFormProvider } from './context/IntroFormContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <IntroFormProvider>
          <App />
        </IntroFormProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
