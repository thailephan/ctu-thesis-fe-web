import React, {useEffect} from 'react';
import { io, Socket } from "socket.io-client";
import {service} from "../config";
import {useAppDispatch, useAppSelector} from "../store";
import {updateUserAvatar, updateUserInformation} from "../store/slices/auth.slice";
import {addMessage, selectChatChannel, updateTypingList} from "../store/slices/chat.slice";
import {removeSentInvitation, showNotification} from "../store/slices/app.slice";

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
            dispatch(updateUserAvatar(avatarUrl));
            dispatch(showNotification({
                content: "Cập nhật ảnh đại diện thành công",
                type: "ok",
            }));
        });
        socket.on("user/updateAvatar/failed", (failedMessage: any) => {
            dispatch(showNotification({
                content: "Error code: 1",
                type: "error",
            }));
            console.log(`user/updateAvatar/failed. ${JSON.stringify(failedMessage)}`);
        });
        socket.on("user/updateAvatar/error", (errorMessage: any) => {
            console.log(`user/updateAvatar/failed. ${JSON.stringify(errorMessage)}`);
        });

        socket.on("user/updateInformation", (newData) => {
            console.log(newData);
            dispatch(updateUserInformation(newData));
            dispatch(showNotification({
                content: "Cập nhật thành công",
                type: "ok",
            }));
        });
        socket.on("user/updateInformation/failed", (failedMessage) => {
            console.log(failedMessage);
        });
        socket.on("user/updateInformation/error", (errorMessage) => {
            console.log(errorMessage);
        });

        /* TYPING */
        socket.on("chat/typing", ({ typingUsersId, channelId }) => {
            console.log("chat/typing", typingUsersId);
            dispatch(updateTypingList({typingList: typingUsersId, channelId: parseInt(channelId.toString())}))
        });
        socket.on("chat/untyping", ({ typingUsersId, channelId }) => {
            console.log("chat/untyping", typingUsersId);
            dispatch(updateTypingList({typingList: typingUsersId, channelId: parseInt(channelId.toString())}))
        });

        /* CHAT */
        socket.on("chat/message/send", ({
                                            channelId,
                                            emitterId,
                                            senderFullName,
                                            senderAvatarUrl,
                                            message
                                        }) => {
            console.log(message, channelId);
            dispatch(addMessage({ channelId, message, emitterId }));
        });
        socket.on("chat/message/received", ({
            messageId, channelId, emitterId,
        }) => {
            console.log("Received", messageId, channelId, emitterId);
            if (emitterId === user?.id) {
                dispatch(showNotification({
                    type: "default",
                    content: `Message received | msgId: ${messageId} | channelId: ${channelId} | This đã nhận`
                }));
            } else {
                dispatch(showNotification({
                    type: "default",
                    content: `Message received | msgId: ${messageId} | channelId: ${channelId} | That Đã nhận`
                }));
            }
        });
        socket.on("chat/message/seen", ({messageId, channelId, emitterId,
                                            }) => {
            console.log("Message seen", messageId, channelId, emitterId);
            if (emitterId === user?.id) {
                dispatch(showNotification({
                    type: "default",
                    content: `Message received | msgId: ${messageId} | channelId: ${channelId} | This Đã xem`
                }));
            } else {
                // TODO: Update state on screen for when selected channel is it
                // dispatch(xxx, messageId, channelId);
                dispatch(showNotification({
                    type: "default",
                    content: `Message received | msgId: ${messageId} | channelId: ${channelId} | That Đã xem`
                }));
            }
        });

        socket.on("invitation/cancel", ({emitterId, receiverId}) => {
            dispatch(removeSentInvitation(receiverId));
        });
        socket.on("invitation/accept", ({emitterId, receiverId}) => {
            console.log({emitterId, receiverId});
        });

        socket.on("friend/unfriend", (data) => {
            console.log(data);
        });

        return () => {
           socket.off("pong");

           socket.off("user/updateAvatar");
           socket.off("user/updateAvatar/failed");
           socket.off("user/updateAvatar/error");

           socket.off("user/updateInformation");
           socket.off("user/updateInformation/failed");
           socket.off("user/updateInformation/error");

           socket.off("chat/typing");
           socket.off("chat/untyping");

           socket.off("chat/message/send");

           socket.off("user/online");
           socket.off("user/offline");

           socket.off("invitation/cancel");
        }
    }, [])

    return (
        <></>
    );
}

export default SocketConnector;