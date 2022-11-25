import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Form, Text, TextArea, Image } from "grommet";
import { Send, Close, Attachment, Image as ImageIcon } from "grommet-icons";
import { socket } from "../../../components/socket";
import { Tip } from "../../../components";
import {useAppDispatch, useAppSelector} from "../../../store";
import Helpers from "../../../common/helpers";
import {
    loadUsersChannelTyping,
    resetReplyFor, sendAttachmentMessage,
    sendChatMessage,
    sendImageMessage
} from "../../../store/slices/chat.slice";

const SIZE = 60;

function ChatBoxContainer() {
    const dispatch = useAppDispatch();
    const { selectedChatChannelId, replyForId, messages } = useAppSelector(state => state.chat);
    const [msg, setMsg] = useState("");

    const attachmentFileRef = useRef<any>(null);
    const imageFileRef = useRef<any>(null);

    useEffect(() => {
        dispatch(loadUsersChannelTyping(selectedChatChannelId));
        dispatch(resetReplyFor());
    }, [selectedChatChannelId])

    const _sendImageMessage: React.ChangeEventHandler<HTMLInputElement> = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            return;
        }
        dispatch(sendImageMessage({ file: e.target.files![0] }))

        e.target.value = "";
    }

    const _sendAttachmentMessage = async (e) => {
        if (!e.target.value) {
            return;
        }
        dispatch(sendAttachmentMessage({ file: e.target.files![0] }))

        e.target.value = "";
    }

    const _sendChatMessage = (e: any)=> {
        e.preventDefault();
        const trimmedMsg = e.value.msg?.trim() || "";

        if (!Helpers.isNullOrEmpty(trimmedMsg)) {
            dispatch(sendChatMessage({ message: trimmedMsg, }));
            e.target.reset();
            setMsg("");
        }
    }

    const _renderActionButtons = () => {
        const baseProps = {
            style: {
                minWidth: SIZE,
                minHeight: SIZE
            },
        };
        if (Helpers.isNullOrEmpty(msg)) {
           return (
               <Box className="d-flex flex-row gap-1">
                   <Box className="position-relative" {...baseProps}>
                       <Tip title="Chọn tài liệu" dropProps={{ align: {bottom: "top" }}}>
                           <Button icon={<Attachment />} className="h-100 border rounded d-flex justify-content-center align-items-center" onClick={() => imageFileRef?.current?.click()} />
                       </Tip>
                       <input type="file" id="upload-attachment" name="upload-attachment"
                              ref={attachmentFileRef}
                              hidden
                              onChange={_sendAttachmentMessage}
                              accept={`*.pdf, *.docx, *.xlsx, *.xls, *.pptx, *.rar, *.zip, *.txt`}
                              className="position-absolute w-100 h-100 opacity-0" />
                   </Box>
                   <Box className="position-relative" {...baseProps}>
                       <Tip title="Chọn ảnh" dropProps={{ align: {bottom: "top" }}}>
                           <Button icon={<ImageIcon />} className="h-100 border rounded d-flex justify-content-center align-items-center" onClick={() => imageFileRef?.current?.click()} />
                       </Tip>
                       <input type="file" id="upload-image" name="upload-image"
                              ref={imageFileRef}
                              hidden
                              onChange={_sendImageMessage}
                              accept="image/png, image/jpeg"
                              className="position-absolute w-100 h-100 opacity-0" />
                   </Box>
               </Box>
           )
        }
        const buttonProps: any = {
            ...baseProps,
            className: "h-100 d-flex justify-content-center align-items-center",
            primary: true,
            type: "submit",
            icon: <Send/>,
        }
        if (Helpers.isNullOrEmpty(msg)) {
            return <Tip title="Nhập tin nhắn và gửi" dropProps={{
                align: {
                    "bottom": "top"
                }
            }}>
                <Button disabled {...buttonProps} />
            </Tip>
        } else {
            return <Button {...buttonProps}/>
        }
    }

    const _renderReplyFor = () => {
        if (replyForId) {
            const replyMessage = messages[replyForId];
            let content: React.ReactNode = "";
            if (replyMessage.messageTypeId === 1) {
               content = replyMessage.message;
            }
            if (replyMessage.messageTypeId === 2 || replyMessage.messageTypeId === 3) {
                const json = JSON.parse(replyMessage.message);
                content = json.fileName;
            }

            return (<Box background="light-3"
                         className="rounded px-2 py-2 mb-2">
                <Box className="w-100 flex-row justify-content-between align-items-center ">
                    <Text size="xsmall">Trả lời cho tin nhắn</Text>
                    <Button icon={<Close size="small"/>} onClick={() => dispatch(resetReplyFor())}/>
                </Box>
                <div className="overflow-auto" style={{ maxHeight: 200, }}>
                    <Text size="small" className="wb-break-all ws-pre-wrap">
                        {content}
                    </Text>
                </div>
            </Box>)
        }
        return <></>;
    }
    return (
        <Box className="w-100">
            {_renderReplyFor()}
            <Form id="message-form" onSubmit={_sendChatMessage}>
                <Box className="d-flex flex-row gap-2">
                    <TextArea
                        id="msg"
                        className="flex-grow-1"
                        placeholder="Nhắn gì đó"
                        resize={false}
                        style={{
                            height: SIZE,
                            maxHeight: SIZE,
                            width: 0,
                        }}
                        onFocus={(e) => {
                            if (selectedChatChannelId) {
                                socket.emit("chat/typing", {channelId: selectedChatChannelId})
                            }
                        }}
                        onBlur={(e) => {
                            if (selectedChatChannelId) {
                                socket.emit("chat/untyping", {channelId: selectedChatChannelId})
                            }
                        }}
                        onChange={(e) => setMsg(e.target.value)}
                        name="msg"/>
                    {_renderActionButtons()}
                </Box>
            </Form>
        </Box>
    );
}

export default ChatBoxContainer;