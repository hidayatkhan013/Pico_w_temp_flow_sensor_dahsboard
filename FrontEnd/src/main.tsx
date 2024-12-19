import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Initialize PWA elements after React has mounted
import { defineCustomElements } from '@ionic/pwa-elements/loader'
defineCustomElements(window).catch(console.error);