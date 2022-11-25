import { Box, Text } from 'grommet';
import React from 'react';
import { useAppSelector } from "../../../store";
import ChatMessage from "./chat-message";

function MessagesContainer() {
    const messages = useAppSelector(state => state.chat.messages) || {};
    const { id } = useAppSelector(state => state.auth.user) || {};

    if (Object.values(messages).length === 0) {
        return  <Box className="w-100 align-items-center justify-content-center h-100">
            <Text>Không có tin nhắn</Text>
        </Box>
    }

    return (
    <div className="d-flex flex-column w-100 rounded p-2">
        <Box className="flex-grow-1 overflow-auto gap-5 pt-2 pb-4 h-100">
            {/*<ChatMessage message={{message: "Ua di ha ban", createdAt: new Date(), messageTypeId: 1, senderFullName: "Phong"}} />*/}
            {/*<ChatMessage message={{message: "Oke", createdAt: new Date(), messageTypeId: 1, senderFullName: "Thai Le" }} isMine />*/}
            {/*<ChatMessage message={{message: "Ua di ha ban", createdAt: new Date(), messageTypeId: 1, senderFullName: "Thai Le" }} isMine />*/}
            {/*<ChatMessage message={{message: '{"fileUrl":"https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8","fileExt":"png","fileName":"good cafe.png"}',*/}
            {/*    createdAt: new Date(), messageTypeId: 2, senderFullName: "Thai Le" }} isMine />*/}
            {/*<ChatMessage message={{message: '{"fileUrl":"https://www.clickdimensions.com/links/TestPDFfile.pdf","fileExt":"pdf","fileName":"TestPDFfile.pdf"}',*/}
            {/*    createdAt: new Date(), messageTypeId: 3, senderFullName: "Phong" }} />*/}
            {/*<ChatMessage message={{message: '{"fileUrl":"https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8","fileExt":"png","fileName":"good cafe.png"}',*/}
            {/*    createdAt: new Date(), messageTypeId: 2, senderFullName: "Phong" }} />*/}
            {Object.values(messages).sort((a, b) => a.id - b.id).map(message => <ChatMessage message={message} key={message.id} isMine={id === message.createdBy}/>)}
        </Box>
    </div>
    );
}

export default MessagesContainer;