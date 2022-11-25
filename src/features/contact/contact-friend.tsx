import React from 'react';
import { Box } from "grommet";
import {useAppSelector} from "../../store";
import ContactFriendItem from "./components/contact-friend-item";

function ContactFriendPage() {
    const friends = useAppSelector(state => state.app.friends);
    return (<Box className="w-100 gap-2">
        {friends.map(friend => {
            return ( <ContactFriendItem {...friend} key={friend.friendId} /> );
        })}
    </Box>)
}

export default ContactFriendPage;