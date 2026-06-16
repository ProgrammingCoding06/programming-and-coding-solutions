import { createRoot } from 'react-dom/client'
import { App, PrivacyPage } from './App.jsx'
import './styles.css'

const rootElement = document.getElementById('root')
const page = rootElement?.dataset.page

if (rootElement) {
  createRoot(rootElement).render(page === 'privacy' ? <PrivacyPage /> : <App />)
}
