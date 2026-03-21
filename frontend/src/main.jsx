// Import React StrictMode for highlighting issues during development
import { StrictMode } from 'react'
//Import function to create the root React rendering container
import { createRoot } from 'react-dom/client'
//Import the global CSS for the application
import './index.css'
// Import the root App component
import App from './App.jsx'

// Mounts the React application into the HTML element with id="root"
//Entry point where the total UI is rendered.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
