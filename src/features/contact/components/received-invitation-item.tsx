import React from 'react';
import {IReceivedInvitation} from "../../../common/interface";
import { Button, Box, Text } from "grommet";
import { Avatar } from "../../../components";
import clsx from "clsx";
import {useAppDispatch} from "../../../store";
import {cancelInvitation} from "../../../store/slices/app.slice";

function ReceivedInvitationItem(props: IReceivedInvitation) {
    const dispatch = useAppDispatch();

    return <Box className="flex-row justify-content-between rounded border p-3" background="light-2">
        <Box className={clsx("flex-row gap-3 align-items-center ")}>
            <Avatar src={props.avatarUrl || undefined} />
            <Box>
                <Text>{props.fullName}</Text>
                <Text size="small">{props.email}</Text>
            </Box>
        </Box>
        <Box className="flex-row">
            <Button className="px-3 border bg-primary rounded" onClick={() => {
            }}>
                <Text size="small" className="text-white">Chấp thuận</Text>
            </Button>
            <Button className="px-3 border bg-danger rounded" onClick={() => {
            }}>
                <Text size="small" className="text-white">Từ chối</Text>
            </Button>
        </Box>
    </Box>
}

export default ReceivedInvitationItem;
