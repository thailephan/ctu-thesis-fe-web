import React, {useEffect} from 'react';
import { io, Socket } from "socket.io-client";
import {service} from "../config";
import {useAppDispatch, useAppSelector} from "../store";
import {updateUserAvatar, updateUserInformation} from "../store/slices/auth.slice";
import {addMessage, updateTypingList} from "../store/slices/chat.slice";
import {removeSentInvitation} from "../store/slices/app.slice";

export const socket: Socket = io(service.chatUrl, {
        autoConnect: false,
        upgrade: true,
    });
function SocketConnector() {
    const dispatch = useAppDispatch();
    const { accessToken, user } = useAppSelector(state => state.auth);

    useEffect(() => {
        if(accessToken) {
            socket.connect();
            socket.auth = {
                accessToken,
            };
        }

        return () => {
            socket.disconnect();
        }
    }, [accessToken])

    useEffect(() => {
        socket.emit("ping");
        socket.on("pong", (data: any) => {
            console.log("server-pong");
        });

        /* USER INFORMATION */
        socket.on("user/updateAvatar", ({avatarUrl}) => {
            console.log("user/updateAvatar");
            dispatch(updateUserAvatar(avatarUrl));
        });
        socket.on("user/updateInformation", (newData) => {
            console.log(newData);
            dispatch(updateUserInformation(newData));
        });

        /* TYPING */
        socket.on("chat/typing", ({ typingUsersId, channelId }) => {
            console.log("chat/typing", typingUsersId);
            dispatch(updateTypingList({typingList: typingUsersId, channelId}))
        });
        socket.on("chat/untyping", ({ typingUsersId, channelId }) => {
            console.log("chat/untyping", typingUsersId);
            dispatch(updateTypingList({typingList: typingUsersId, channelId}))
        });

        /* CHAT */
        socket.on("chat/message/send", ({
                                            channelId,
                                            senderId,
                                            senderFullName,
                                            senderAvatarUrl,
                                            message
                                        }) => {
            console.log(message, channelId);
            dispatch(addMessage({ channelId, message }));
        });


        /* User online status */
        socket.on("user/online", ({ userId }) => { });
        socket.on("user/offline", ({ userId }) => { });

        socket.on("invitation/cancel", ({emitterId, receiverId}) => {
            if (emitterId === user?.id) {
                dispatch(removeSentInvitation(receiverId));
            }
        });

        return () => {
           socket.off("pong");

           socket.off("user/updateAvatar");
           socket.off("user/updateInformation");

           socket.off("chat/typing");
           socket.off("chat/untyping");

           socket.off("chat/message/send");

           socket.off("user/online");
           socket.off("user/offline");

           socket.on("invitation/cancel");
        }
    }, [])

    return (
        <></>
    );
}

export default SocketConnector;