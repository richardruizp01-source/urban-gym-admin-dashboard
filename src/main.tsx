import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 🚀 Limpiamos el StrictMode para evitar el doble renderizado y errores de nodo
createRoot(document.getElementById('root')!).render(
    <App />
)