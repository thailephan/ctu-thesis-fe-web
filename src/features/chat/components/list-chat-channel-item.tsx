import { Button, Text } from 'grommet';
import React from 'react';
import {IChannel} from "../../../common/interface";
import {useAppDispatch, useAppSelector} from "../../../store";
import { Avatar } from "../../../components";
import {selectChatChannel} from "../../../store/slices/chat.slice";

interface IProps extends IChannel {

}

function ListChatChannelItem(props: IProps) {
    const channel = props;
    const dispatch = useAppDispatch();
    const selectedChatChannelId = useAppSelector((state) => state.chat.selectedChatChannelId);

    return (
        <Button style={{
            display: "flex",
            alignItems: "center",
            border: "none",
            background: selectedChatChannelId === channel.id ? "#7d4cdb55" : "none"
        }} className="p-3 gap-3" key={channel.id}
                onClick={() => {
                    dispatch(selectChatChannel(channel.id));
                }}
        >
            <Avatar src={channel.channelAvatarUrl} />
            <div className="d-flex gap-2 flex-column">
                <Text size="medium">{channel.channelName}</Text>
                <Text size="medium" color="dark-1">{channel.lastMessageId}</Text>
            </div>

            {/* TODO: Channel - new message color */}
            {/*<div className="ms-auto" style={{*/}
            {/*    backgroundColor: "orange",*/}
            {/*    width: 15,*/}
            {/*    height: 15,*/}
            {/*    borderRadius: "50%"*/}
            {/*}}>*/}
            {/*</div>*/}
        </Button>
    );
}

export default ListChatChannelItem;