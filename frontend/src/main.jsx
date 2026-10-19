import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import appStore from './utils/appStore.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <BrowserRouter basename='/'>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
