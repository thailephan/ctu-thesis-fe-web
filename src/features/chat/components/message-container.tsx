import { Box, Text } from 'grommet';
import React, {useEffect} from 'react';
import { useAppSelector } from "../../../store";
import ChatMessage from "./chat-message";

function MessagesContainer() {
    const ref = React.useRef<any>();
    const messages = useAppSelector(state => state.chat.messages) || {};
    const { id } = useAppSelector(state => state.auth.user) || {};
    const sortedMessages = Object.values(messages).sort((a, b) => a.id - b.id);

    useEffect(() => {
        if (ref?.current) {
            // Container boxbox
            ref.current.scrollTop = ref.current.scrollHeight || 0;
        }
    }, [messages])
    if (Object.values(messages).length === 0) {
        return  <Box className="w-100 align-items-center justify-content-center h-100">
            <Text>Không có tin nhắn</Text>
        </Box>
    }

    return (
    <div className="d-flex flex-column w-100 rounded p-2">
        <Box className="flex-grow-1 gap-5 pt-2 pb-4" ref={ref} style={{
            maxHeight: 600
        }}>
            {sortedMessages.map((message, index) => {
                return <ChatMessage message={message} key={message.id} isMine={id === message.createdBy} />
            })}
        </Box>
    </div>
    );
}

export default MessagesContainer;