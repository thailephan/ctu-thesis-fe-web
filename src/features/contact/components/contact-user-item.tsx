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
import {socket} from "../../../components/socket";
import {showNotification} from "../../../store/slices/app.slice";

interface IProps extends IUser {
    className?: string;
}

function ContactUserItem(props: IProps) {
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
                            id: props.id,
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
                <Button onClick={(e) => {
                    e.stopPropagation();
                    socket.emit("invitation/send", {receiverId: props.id});
                    navigate(Screens.CONTACT_INVITATIONS);
                }}>
                    <Box background="brand" className="flex-row align-items-center justify-content-center p-2 rounded">
                        Kết bạn
                    </Box>
                </Button>
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

export default React.memo(ContactUserItem, (prevProps, nextProps) => prevProps.className === nextProps.className);
