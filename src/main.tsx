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

// storeMessage(
//     {
//         channelId: 30,
//         id: 46,
//         createdAt: 1668952574,
//         messageTypeId: 2,
//         message: '{"fileUrl":"/2022/nov/gap-gv-huong-dan-luan-van-205614-da8cc217a1.png","fileName":"gap-gv-huong-dan-luan-van.png","fileExt":"png","fileSize":77119}',
//         createdBy: 2,
//         status: 1,
//         replyForId: 41
//     }
// ).then(a => console.log(a));
getMesasgeByChannel({channelId: 29}).then(a => console.log(a));