import React from 'react';
import { Box, Text, Button } from "grommet";
import {useAppSelector} from "../../store";
import ContactGroupItem from "./components/contact-group-item";

function ContactGroupPage() {
    const { groups } = useAppSelector(state => state.app);

    return (<Box className="flex-wrap w-100">
        {groups?.length === 0 ? (<NoGroup />) : groups.map(group => {
            return ( <ContactGroupItem {...group} key={group.id} className="col-12 col-md-6" /> );
        })}
    </Box>)
}

function NoGroup() {
    return (
        <Box className="align-items-center gap-3">
            <Text>
                Bạn chưa tham gia nhóm nào cả?
            </Text>
            <Box className="flex-row align-items-center gap-1">
                 <Button onClick={() => {}}>
                     <Box background="brand" className="rounded" pad="small">
                         <Text>Tạo nhóm với bạn bè</Text>
                     </Box>
                 </Button>
            </Box>
        </Box>
    )
}
export default ContactGroupPage;
