import React from 'react';
import { Button, Box, Text } from "grommet";
import {signout} from "../../store/slices/auth.slice";
import { useAppDispatch } from "../../store";

export default function AccountSettingPage() {
    const dispatch = useAppDispatch();

    return <Box>
        <Button onClick={() => dispatch(signout())}>
            <Box className="p-4 rounded opacity-75 border">
                <Text>Đăng xuất</Text>
            </Box>
        </Button>
    </Box>
}
