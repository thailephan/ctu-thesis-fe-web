import { Box, Card, CardHeader, CardBody, Text } from 'grommet';
import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../store";
import SentInvitationItem from "./components/sent-invitation-item";
import ReceivedInvitationItem from "./components/received-invitation-item";
import {loadInvitations} from "../../store/slices/app.slice";

function ContactInvitationPage() {
    const dispatch = useAppDispatch();
    const { sentInvitations, receivedInvitations } = useAppSelector(state => state.app);

    useEffect(() => {
        dispatch(loadInvitations());
    }, [])

    if (sentInvitations.length === 0 && receivedInvitations.length === 0) {
        return  <Box className="align-items-center justify-content-center mt-4">Không có lời mời kết bạn</Box>;
    }
    return (
        <Box className="w-100 gap-4">
            {
                sentInvitations.length !== 0 && (
                    <Box className="gap-2 overflow-auto">
                        <Text>
                           Lời mời đã gửi
                        </Text>
                        <Box>
                            {sentInvitations.map(s => <SentInvitationItem {...s} key={s.email}/> )}
                        </Box>
                    </Box>)
            }
            {receivedInvitations.length !== 0 && (
                <Box className="gap-2 overflow-auto">
                    <Text>
                        Yêu cầu kết bạn
                    </Text>
                    <Box>
                        {receivedInvitations.map((s) => <ReceivedInvitationItem {...s} key={s.email}/> )}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default ContactInvitationPage;