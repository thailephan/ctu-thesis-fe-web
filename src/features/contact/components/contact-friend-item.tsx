import React, {useEffect} from "react";
import { useAppDispatch } from "../../../store";
import {IFriend, IUser} from "../../../common/interface";
import Screens from "../../../common/screens";
import { useNavigate } from 'react-router-dom';
import { Button, Box, Text, Spinner } from "grommet";
import { Chat, Close } from "grommet-icons";
import { Avatar, Tip } from "../../../components";
import {selectChatChannel} from "../../../store/slices/chat.slice";
import {apiService} from "../../../services";

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
                        path: "/users/getUserById",
                        data: {
                            id: props.friendId,
                        },
                    });
                    if (loadUser.data.success) {
                        setUser(loadUser.data.data);
                    } else {
                        setUser(null);
                    }
                }
            } catch (e) {
                setUser(null);
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
                        dispatch(selectChatChannel(props.friendId));
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
                        dispatch(selectChatChannel(props.friendId));
                        navigate(Screens.HOME);
                    }}>
                        <Box className="flex-row align-items-center justify-content-center p-2 rounded">
                            <Close />
                        </Box>
                    </Button>
                </Tip>
            </Box>
        </Box>

        {isShowInformation && (
            <Box className="align-items-center justify-content-center w-100 h-100 position-absolute top-0" style={{
                zIndex: 21,
                left: 0,
                backgroundColor: "#FFFFFF88",
            }} onClick={() => setIsShowInformation(false)}>
                {loading ? (
                    <Box>
                        <Spinner />
                    </Box>
                ) : (
                    user ?
                    (
                        user.avatarUrl
                    ) : <div>Không thể tải thông tin người dùng</div>
                )}
            </Box>
        )}
    </Box>
}

export default React.memo(ContactFriendItem, (prevProps, nextProps) => prevProps.className === nextProps.className);