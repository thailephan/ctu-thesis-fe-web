import { Box, Button, Text } from "grommet";
import { Close } from "grommet-icons";
import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../store";
import {hideNotification} from "../store/slices/app.slice";

let timeout: any;
function Notification() {
    const { content, type, duration } = useAppSelector(state => state.app.notification);
    const dispatch = useAppDispatch();

    useEffect(() => {
        timeout = setTimeout(() => {
            dispatch(hideNotification());
        }, duration);
        return () => {
            clearTimeout(timeout);
        }
    })

    return content && (
        <Box pad="small"
             className="position-fixed shadow-sm rounded gap-3 flex-row justify-content-between align-items-center text-white"
             background={type === "default" ? "dark-6" : `status-${type}`} style={{
            right: "1rem",
            top: "1rem",
        }}>
            <Text style={{
                maxWidth: 400,
                textOverflow: "ellipsis",
            }}>{content}</Text>

            <Button onClick={() => {
                clearTimeout(timeout);
                dispatch(hideNotification());
            }}>
                <Close size="small" color="white"/>
            </Button>
        </Box>
    );
}

export default Notification;