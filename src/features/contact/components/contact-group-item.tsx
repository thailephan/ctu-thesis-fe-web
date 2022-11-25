import {useAppDispatch} from "../../../store";
import {IChannel} from "../../../common/interface";
import {selectChatChannel} from "../../../store/slices/chat.slice";
import Screens from "../../../common/screens";
import { useNavigate } from 'react-router-dom';
import { Button, Box, Text } from "grommet";
import { Avatar } from "../../../components";
import clsx from "clsx";

interface IProps extends IChannel {
    className?: string;
}

function ContactGroupItem(props: IProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return <Button className={props.className} onClick={() => {
        dispatch(selectChatChannel(props.id));
        navigate(Screens.HOME);
    }}>
        <Box background="light-2"
             className={clsx("flex-row gap-3 align-items-center rounded border p-3")}>
            <Avatar src={props.channelAvatarUrl}/>
            <Text>{props.channelName}</Text>
            <Text>{props.memberIds}</Text>
        </Box>
    </Button>
}

export default ContactGroupItem;