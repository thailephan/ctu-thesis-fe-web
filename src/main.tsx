import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "@fontsource/roboto";
import './index.css'
import { store } from "./store";
import { Provider } from 'react-redux';
import { init } from "./store/slices/app.slice";
import SocketConnector from "./components/socket";
import {getMesasgeByChannel} from "./common/indexdb";

store.dispatch(init()).then(() => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <React.StrictMode>
            <GoogleOAuthProvider clientId="890950202267-fi65usbl7k70g7bk1261skbol311smct.apps.googleusercontent.com">
                <Provider store={store}>
                    <App />
                    <SocketConnector />
                </Provider>
            </GoogleOAuthProvider>
        </React.StrictMode>
    )
});

// getMesasgeByChannel({channelId: 29}).then(a => console.log(a));