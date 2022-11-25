import { useGoogleLogin } from '@react-oauth/google';
import React from "react";

const scopes = [
    'email',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
];

function LoginPage() {
    const login = useGoogleLogin({
        redirect_uri: "http://localhost:5173",
        onSuccess: tokenResponse => {
            console.log(tokenResponse);
            // axios.post("https://localhost:7115/GoogleAuth", {
            //    code: tokenResponse.code,
            //    id: "3",
            //     hd: tokenResponse.hd || "-empty",
            // }).then(console.log).catch(console.log);
        },
        onError: err => {
            console.log(err);
        },
        scope: scopes.join(" "),
        flow: 'auth-code',
    });

// Send to server codeResponse
//     {
//     "code": "4/0ARtbsJrsKKdQHL0MgUbqrjETcP6ib8FunK2NZLtpD-CMcGpf0ly9iN8grpWV3BI1ryfV6Q",
//     "scope": "email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
//     "authuser": "0",
//     "prompt": "consent"
// }

    return (
        <div>
            This is login home screen
            <button onClick={login}>Sign in google</button>
        </div>
    );
}

export default LoginPage;