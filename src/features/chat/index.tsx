import React, {useState} from 'react';
import { Button, Box, Card, CardBody, Text, TextInput, CardFooter, CardHeader, Page } from "grommet";
import { Search, Document, Gallery, CaretDown, CaretUp, Close } from "grommet-icons";
import "./styles.css";
import { Tip, Avatar } from '../../components';
import {useAppDispatch, useAppSelector} from "../../store";
import MessagesContainer from "./components/message-container";
import TypingListContainer from './components/typing-list-container';
import ChatBoxContainer from "./components/chat-box-container";
import {IChannel} from "../../common/interface";
import ListChatChannelItem from "./components/list-chat-channel-item";
import Screens from "../../common/screens";
import { Link } from "react-router-dom";

function ChatPage() {
    const { channels } = useAppSelector(state => state.app);
    const { selectedChatChannelId } = useAppSelector(state => state.chat );
    const dispatch = useAppDispatch();

    const [isSearchChatMessage, setIsSearchChatMessage] = useState(false);
    const selectedChatChannel = channels.find(c => c.id === selectedChatChannelId);

    const renderOnlineStatus = () => {
        return (<div style={{
            zIndex: 101,
            width: 16,
            height: 16,
            position: "absolute",
            bottom: -4,
            right: 4,
            background: "#008C4E",
            borderRadius: "50%",
            border: "1px solid #1ad328",
        }}></div>)
    }

    return (
        <Page kind="full" className="d-flex flex-row" background="light-3">
            <Box className="flex-row flex-grow-1 justify-content-around flex-wrap gap-2 p-3" style={{ height: "100vh", }}>
                <Card style={{ width: 350 }} className="d-none d-lg-flex">
                    <CardBody background="light-1" className="overflow-auto py-2 gap-1">
                        {channels.length > 0 ? channels.map((channel: IChannel, index: any) => (
                            <ListChatChannelItem {...channel} key={channel.id + index}/>
                        )) : <div className="d-flex align-items-center justify-content-center flex-column h-100"><div>Không có cuộc trò chuyện nào.</div> Tìm bạn bè trong <Link to={Screens.CONTACT_SEARCH}><b><Button primary className="p-2 rounded">Liên hệ</Button></b></Link></div>}
                    </CardBody>
                </Card>

                <Card className="flex-grow-1 d-flex flex-column h-100" background="light-1" style={{ width: 0 }}>
                    {selectedChatChannelId ? (
                            <>
                                <CardHeader className="p-3 shadow-sm flex-column gap-3" background="light-1">
                                    <Box className="d-flex flex-row w-100">
                                        <Box className="flex-row gap-3 align-items-center">
                                            <Box className="position-relative">
                                                <Avatar src={selectedChatChannel?.channelAvatarUrl} />
                                                {/*{renderOnlineStatus()}*/}
                                            </Box>
                                            <Text size="medium" weight="bold">{selectedChatChannel?.channelName || "Không"}</Text>
                                        </Box>
                                        <Box className="flex-row ms-auto">
                                            <Tip title="Tìm kiếm" dropProps={{
                                                align: {
                                                    top: "bottom"
                                                }
                                            }}>
                                                <Button icon={<Search/>}
                                                        onClick={() => setIsSearchChatMessage(value => !value)}/>
                                            </Tip>
                                            <Tip title="Danh mục hình ảnh" dropProps={{
                                                align: {
                                                    top: "bottom"
                                                }
                                            }}>
                                                <Button icon={<Gallery/>}/>
                                            </Tip>
                                            <Tip title="Danh mục file" dropProps={{align: {top: "bottom"}}}>
                                                <Button icon={<Document/>}/>
                                            </Tip>
                                        </Box>
                                    </Box>
                                    {isSearchChatMessage && (<Box className="flex-row gap-2 w-100">
                                            <TextInput
                                                placeholder="Nhập nội dung tìm kiếm"
                                                id="search-in-chat" name="search-in-chat"
                                                className="w-100"
                                            />
                                            <Box className="flex-row">
                                                <Button icon={<CaretUp size="small"/>} />
                                                <Button icon={<CaretDown size="small" />}/>
                                                <Button icon={<Close size="small" />}
                                                        onClick={() => setIsSearchChatMessage(false)}/>
                                            </Box>
                                        </Box>
                                    )}
                                </CardHeader>
                                <CardBody className="p-2 overflow-auto" background="light-3">
                                    <MessagesContainer />
                                </CardBody>
                                <CardFooter background="light-1" className="d-flex mt-2 px-3 py-2 flex-column align-items-start w-100 position-relative">
                                    <TypingListContainer />
                                    <ChatBoxContainer />
                                </CardFooter>
                            </>)
                        : (<div className="d-flex align-items-center justify-content-center h-100">
                            <h5>Chọn kênh để chat</h5>
                        </div>)}
                </Card>
            </Box>
        </Page>
    );
}

export default ChatPage;