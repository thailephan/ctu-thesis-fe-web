import React, {useEffect} from 'react';
import { googleLogout } from '@react-oauth/google';

import Cart from "../../components/cart";

const conn = new WebSocket('ws://localhost:8080/ws');

const defaultCart = {
    items: [{
        id: 1,
        name: "Socks",
        inCartAt: "0",
        attribute: [{
            id: 1,
            code: "001001",
            name: "Length",
            value: "Long",
        },{
            id: 2,
            code: "001002",
            name: "Material",
            value: "Nylon",
        },],
    }],
    total: 1,
};

function HomePage() {
    useEffect(() => {
        if (window["WebSocket"]) {
            // Connection opened
            conn.onopen = ev => {
                conn.send(`{"message_id": 1}`)
                console.log(ev, conn);
            };
            conn.onerror = ev => {
               console.log("Error", ev);
            }
            conn.onclose = ev => {
                console.log("Websocket connection close", ev);
            }
            conn.onmessage = (event) => {
                console.log("Message", event);
            }
        } else {
            alert("brower does not support websocket")
        }

    }, [])

    const _handleSendMesasge = (e: any) => {
        console.log("CLick message", conn);
        const msg = {
            group_id: 1,
            message_id: 2,
            from: 1,
            to: 1,
            content: "1",
            reply_for: -1,
            created_at: new Date(),
            updated_at: new Date(),
        }
        conn.send(JSON.stringify(msg))
    }

    return (
        <>
            <div>This is home page</div>
            <button onClick={_handleSendMesasge}>Send message</button>
            <button onClick={googleLogout}>Logout</button>
            <Cart />
        </>
    );
}

export default HomePage;