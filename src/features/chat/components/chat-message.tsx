import React, {useEffect, useState} from "react";
import { format } from 'date-fns';
import { Button, Box, Card, CardBody, Text, Avatar, CardFooter, CardHeader, Footer, Image, DropButton, Menu } from "grommet";
import { User, Download, Document, More } from "grommet-icons";
import {service} from "../../../config";
import Helpers from "../../../common/helpers";
import {setReplyFor} from "../../../store/slices/chat.slice";
import {useAppDispatch, useAppSelector} from "../../../store";

interface IChatMessageProps {
    message: any;
    isMine?: boolean;
}

function ChatMessage({message, isMine = false }: IChatMessageProps) {
    const dispatch = useAppDispatch();
    const { messages } = useAppSelector(state => state.chat) || {};
    const [imageZoomUrl, setImageZoomUrl] = useState("");
    const { id, createdAt, messageTypeId, senderFullName, senderAvatarUrl, replyForId } = message;

    const renderMessageContent = () => {
        const json = messageTypeId !== 1 ? JSON.parse(message.message) : {};
        json.fileUrl = service.assetUrl + json.fileUrl;
        switch (messageTypeId) {
            // Text
            case 1:
                return <Text color="dark-1" className="d-inline-block px-3 pt-2 ws-pre-wrap wb-break-all" size="small">{message.message}</Text>;
            // Image
            case 2:
                // TODO: Export into JSON (json.parse)
                return (<>
                    <Button onClick={() => setImageZoomUrl(json.fileUrl)} className="pt-2">
                        <Box
                            width="medium"
                            className="rounded"
                        >
                            <Image
                                fit="contain"
                                className="rounded"
                                src={json.fileUrl}
                            />
                        </Box>
                    </Button>
                    <Footer color="dark-6" className="pt-2 px-3 align-items-start">
                        <Box>
                            <Text size="small" weight="bold" className="wb-break-all">{json.fileName}</Text>
                            <Text size="xsmall">{Helpers.formatBytes(json.fileSize)}</Text>
                        </Box>
                        <Button className="position-relative">
                            <Download size="small" className="ms-4" />
                            <a href={json.fileUrl} download={json.fileName} target="_blank" className="position-absolute d-block w-100 h-100 top-0"/>
                        </Button>
                    </Footer>
                </>);
            // File
            case 3:
                return <Box className="px-3 pt-3">
                    <Button className="d-flex gap-2 flex-row position-relative p-3 border">
                        <Document />
                        <Text size="small" weight="bold" className="wb-break-all">{json.fileName}</Text>
                        <Download size="small" className="ms-4" />
                        <a href={json.fileUrl} download={json.fileName} target="_blank"className="position-absolute d-block w-100 h-100 top-0"/>
                    </Button>
                </Box>;
            default:
                return <div></div>;
        }
    }

    const renderMessageAction = () => {
        return <Box>
            <Menu
                icon={<More size="small"/>}
                items={[
                    {
                        label: <Box alignSelf="center"><Text size="small">Trả lời tin nhắn</Text></Box>,
                        onClick: () => { dispatch(setReplyFor(id)); }
                    },
                    {
                        label: <Box alignSelf="center"><Text size="small">Xóa tin nhắn</Text></Box>,
                        onClick: () => { }
                    },
                ]}
            />
        </Box>;
    }

    const _renderReplyMessage = () => {
        if (replyForId) {
            const replyMessage = messages[replyForId];
            let content: React.ReactNode = "";
            if (replyMessage.messageTypeId === 1) {
                content = <Text size="small">{replyMessage.message}</Text>;
            }
            if (replyMessage.messageTypeId === 2 || replyMessage.messageTypeId === 3) {
                const json = JSON.parse(replyMessage.message);
                content = json.fileName;
            }

            return (<Box background="dark-3"
                         className="flex-row justify-content-between align-items-center rounded px-2 py-2">
                <Text size="small" className="ws-pre-wrap wb-break-all">{content}</Text>
            </Box>)
        }
        return <></>;
    }

    if (isMine) {
        return (
            <Box className="align-items-end chat-channel-message" style={{
                paddingLeft: "10%",
                minHeight: 100,
            }}>
                {_renderReplyMessage()}
                <Box className="d-flex flex-row gap-3 flex-row-reverse">
                    <Card background="light-1" style={{
                        minWidth: 100
                    }} className="pb-3 d-flex w-100">
                        <CardBody className="d-flex mb-2 pt-2">
                            {renderMessageContent()}
                        </CardBody>
                        <CardFooter className="px-3">
                            <Text size="small" className="ms-auto">{format(createdAt, "HH:mm")}</Text>
                        </CardFooter>
                    </Card>
                    {renderMessageAction()}
                </Box>
                {imageZoomUrl !== "" && (
                    <Box style={{
                        backgroundColor: "#1116",
                        zIndex: 9999,
                        right: 0,
                        cursor: "default",
                    }} className="position-absolute w-100 h-100 p-4 align-items-center justify-content-center top-0"
                         onClick={() => setImageZoomUrl("")}>
                        <div style={{maxWidth: "80vw"}} className="overflow-hidden rounded" onClick={(e) => {
                            e.stopPropagation()
                        }}>
                            <Image
                                fit="contain"
                                src={imageZoomUrl}
                                className="w-100 h-100"
                            />
                        </div>
                    </Box>
                )}
            </Box>);
    }

    return (<Box className="d-flex flex-row gap-3 flex-row me-auto chat-channel-message" style={{
                paddingRight: "10%",
                minHeight: 100,
        }}>
        <div>
            <Button>
                {senderAvatarUrl
                    ? <Avatar src={senderAvatarUrl}/>
                    : (<Avatar background="brand">
                        <User color="text-strong"/>
                    </Avatar>)
                }
            </Button>
        </div>
        <Box className="flex-row gap-3">
            <Card background="light-1" style={{
                minWidth: 100,
            }} className="py-3 w-100">
                <CardHeader className="px-3">
                    <Text size="xsmall" color="dark-3">{senderFullName} {id}</Text>
                </CardHeader>
                <CardBody className="d-flex mb-2">
                    {renderMessageContent()}
                </CardBody>
                <CardFooter className="px-3">
                    <Text size="small" className="ms-auto">{format(createdAt, "HH:mm")}</Text>
                </CardFooter>
            </Card>
            {renderMessageAction()}
        </Box>
        {imageZoomUrl !== "" && (
            <Box style={{
                backgroundColor: "#1116",
                zIndex: 9999,
                right: 0,
                cursor: "default",
            }} className="position-absolute w-100 h-100 p-4 align-items-center justify-content-center top-0" onClick={() => setImageZoomUrl("")}>
                <div style={{ maxWidth: "80vw" }} className="overflow-hidden rounded" onClick={(e) => {e.stopPropagation()}}>
                    <Image
                        fit="contain"
                        src={imageZoomUrl}
                        className="w-100 h-100"
                    />
                </div>
            </Box>
        )}
    </Box>);
}

export default ChatMessage;