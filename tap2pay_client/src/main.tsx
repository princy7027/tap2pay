import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    {/* <StrictMode> */}
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    {/* </StrictMode> */}
  </BrowserRouter>,
)
