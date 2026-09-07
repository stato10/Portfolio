import React from 'react'
import ReactDOM from 'react-dom/client'
import './gsap/registerPlugins'
import App from './App.jsx'
import '../style.css'
import './os/portfolio-polish.css'
import './os/macos.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
