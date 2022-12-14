import React, {useEffect} from "react";
import { useAppDispatch } from "../../../store";
import {IFriend, IUser} from "../../../common/interface";
import Screens from "../../../common/screens";
import { useNavigate } from 'react-router-dom';
import { Button, Box, Text, Spinner, Card } from "grommet";
import { Chat, Close } from "grommet-icons";
import { Avatar, Tip } from "../../../components";
import {selectChatChannel} from "../../../store/slices/chat.slice";
import {apiService} from "../../../services";
import {socket} from "../../../components/socket";

interface IProps extends IFriend {
    className?: string;
}

function ContactFriendItem(props: IProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isShowInformation, setIsShowInformation] = React.useState(false);
    const [user, setUser] = React.useState<IUser | null>(null);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        (async function() {
            setLoading(true);
            try {
                if (isShowInformation) {
                    const loadUser = await apiService.Get({
                        path: "/users/getUserById/" + props.friendId,
                    });
                    console.log(loadUser);
                    if (loadUser.data.success) {
                        setUser(loadUser.data.data);
                    } else {
                        setUser(null);
                    }
                }
            } catch (e) {
                setUser(null);
                console.log(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [isShowInformation])

    return <Box className={props.className}>
        <Box background="light-2" className="flex-row justify-content-between">
            <Box className="flex-row align-items-center gap-2 p-3">
                <Tip title="Xem thông tin" dropProps={{
                    align: {top: "bottom"},
                }}>
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        setIsShowInformation(true);
                    }}>
                        <Avatar src={props.avatarUrl}/>
                    </Button>
                </Tip>
                <Text>{props.fullName}</Text>
            </Box>

            <Box className="flex-row ps-2 pe-4 gap-3">
                <Tip title="Nhắn tin" dropProps={{
                    align: {top: "bottom"},
                }}>
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        dispatch(selectChatChannel(props.channelId));
                        navigate(Screens.HOME);
                    }}>
                        <Box background="brand" className="flex-row align-items-center justify-content-center p-2 rounded">
                            <Chat/>
                        </Box>
                    </Button>
                </Tip>
                <Tip title="Hủy kết bạn" dropProps={{
                    align: {top: "bottom"},
                }}>
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Bạn có chắc hủy kết bạn? Việc này sẽ xóa cuộc trò chuyện của bạn và " + props.fullName)) {
                            socket.emit("friend/unfriend", { receiverId: props.friendId });
                        }
                    }}>
                        <Box className="flex-row align-items-center justify-content-center p-2 rounded">
                            <Close />
                        </Box>
                    </Button>
                </Tip>
            </Box>
        </Box>

        {isShowInformation && (
            <Box className="align-items-center justify-content-center w-100 h-100 position-absolute top-0 border" style={{
                zIndex: 21,
                left: 0,
                backgroundColor: "#AAAAAA88",
            }} onClick={() => setIsShowInformation(false)}>
                {loading ? <div><Spinner /></div> : (
                    user ? (<Box background="light-1" pad="medium" className="gap-3">
                        <Box className="flex-row align-items-center justify-content-center">
                            <Avatar src={user.avatarUrl}/>
                        </Box>
                        <Box className="flex-row gap-3 justify-content-between">
                            <Text style={{
                                width: 200,
                            }}>Họ tên (tên hiển thị)</Text>
                            <Text>{user.fullName}</Text>
                        </Box>
                        <Box className="flex-row gap-3 justify-content-between">
                            <Text style={{
                                width: 200,
                            }}> Email</Text>
                            <Text>{user.email}</Text>
                        </Box>
                        <Box className="flex-row gap-3 justify-content-between">
                            <Text style={{
                                width: 200,
                            }}>Số điện thoại</Text>
                            <Text>{user.phoneNumber || "Không"}</Text>
                        </Box>
                        <Box className="flex-row gap-3 justify-content-between">
                            <Text style={{
                                width: 200,
                            }}>Giới tính</Text>
                            <Text>{user.gender === 0 ? "Nam" : "Nữ"}</Text>
                        </Box>
                    </Box>
                    ): <div>Không thể lấy thông tin người dùng</div>  )}
            </Box>
        )}
    </Box>
}

export default React.memo(ContactFriendItem, (prevProps, nextProps) => prevProps.className === nextProps.className);