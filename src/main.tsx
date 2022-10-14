import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "@fontsource/roboto";
import 'antd/dist/antd.css';
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <GoogleOAuthProvider clientId="667215334843-5nh6j26n39j711eqbou1kkvo4cfiq7qt.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
  </React.StrictMode>
)
