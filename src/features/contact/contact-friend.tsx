import React from 'react';
import { Box, Button, Text } from "grommet";
import { Link } from "react-router-dom";
import {useAppSelector} from "../../store";
import ContactFriendItem from "./components/contact-friend-item";
import Screens from "../../common/screens";

function ContactFriendPage() {
    const friends = useAppSelector(state => state.app.friends);

    return (<Box className="w-100 gap-2">
        {friends?.length === 0 ? (<NoFriend />) : friends.map(friend => {
            return ( <ContactFriendItem {...friend} key={friend.friendId} /> );
        })}
    </Box>)
}

function NoFriend() {
   return (
       <Box className="align-items-center gap-3">
           <Text>
               Bạn chưa có người bạn nào cả?
           </Text>
           <Box className="flex-row align-items-center gap-1">
               <Link to={Screens.CONTACT_SEARCH}>
                   <Button>
                       <Box background="brand" className="rounded" pad="small">
                           <Text>Tìm kiếm</Text>
                       </Box>
                   </Button>
               </Link>
               <Text>và thêm bạn mới</Text>
           </Box>
       </Box>
   )
}

export default ContactFriendPage;