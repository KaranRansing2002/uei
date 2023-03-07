import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import {Auth0Provider} from '@auth0/auth0-react'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Auth0Provider
        domain="uei.jp.auth0.com"
        clientId="h7QhRpWhg0giD4Erd7UDEEh7d6jHMfix"
        responseType='code'
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience:"https://uei-api.com",
          scope:"openid profile email"
        }}
      >
        <App />
      </Auth0Provider>
    </Router>
  </React.StrictMode>,
)
