import React, {useState} from 'react';
import {ISentInvitation} from "../../../common/interface";
import { Button, Box, Text } from "grommet";
import { Avatar } from "../../../components";
import clsx from "clsx";
import {useAppDispatch} from "../../../store";
import {cancelInvitation} from "../../../store/slices/app.slice";

function SentInvitationItem(props: ISentInvitation) {
    const dispatch = useAppDispatch();

    return <Box className="flex-row justify-content-between rounded border p-3" background="light-2">
        <Box className={clsx("flex-row gap-3 align-items-center ")}>
            <Avatar src={props.avatarUrl || undefined} />
            <Box>
                <Text>{props.fullName}</Text>
                <Text size="small">{props.email}</Text>
            </Box>
        </Box>
        <Button className="px-3 border bg-danger rounded" onClick={() => {
            if (confirm("Hủy bỏ lời mời kết bạn")) {
                dispatch(cancelInvitation(props.receiverId));
            }
        }}>
            <Text size="small" className="text-white">Hủy bỏ</Text>
        </Button>
    </Box>
}

export default SentInvitationItem;