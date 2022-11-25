import React from 'react';
import { Box, Text } from "grommet";
import {useAppSelector} from "../../../store";

function TypingListContainer() {
    const typingList = useAppSelector(state => state.chat.typingList) || [];
    const { id } = useAppSelector(state => state.auth.user) || {};

    const _renderTypingText = () => {
        const typingUsers = [];
        let hasMe = false;
        const MAX_USER_TYPING_SHOW = 2;
        let leftTypingNotShow = 0;

        for (let i = 0; i < typingList.length; i++) {
            if (typingList[i] === id) {
               hasMe = true;
            } else {
                typingUsers.push(typingList[i]);
                if (typingUsers.length === MAX_USER_TYPING_SHOW) {
                    leftTypingNotShow = typingList.length - 1 - i;
                   break;
                }
            }

        }
        let typingText = leftTypingNotShow > 0 ? [...typingUsers, `${leftTypingNotShow} người khác`].join(", "): typingUsers.join(", ");
        typingText = hasMe ? typingText + (typingText.length > 0 ? " và bạn" : "Bạn") + ""  : typingText;
        return typingText;
    }

    return (typingList.length !== 0 ? (<Box className="flex-row">
            <div className="chatTypingIndicatorContainer position-absolute">
                <Box background="light-6" className="flex-row chatTypingIndicatorBubble p-2 gap-2">
                    <Text size="xsmall">{_renderTypingText()} đang soạn tin</Text>
                    <div className="chatTypingIndicatorBubbleDot"></div>
                    <div className="chatTypingIndicatorBubbleDot"></div>
                    <div className="chatTypingIndicatorBubbleDot"></div>
                </Box>
            </div>
        </Box>) : <></>
    );
}

export default TypingListContainer;