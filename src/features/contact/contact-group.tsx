import React from 'react';
import { Box } from "grommet";
import {useAppSelector} from "../../store";
import ContactGroupItem from "./components/contact-group-item";

function ContactGroupPage() {
    const { groups } = useAppSelector(state => state.app);

    return (<Box className="flex-row flex-wrap w-100 gap-2 gap-md-0">
        {groups.map(group => {
            return ( <ContactGroupItem {...group} key={group.id} className="col-12 col-md-6" /> );
        })}
    </Box>)
}

export default ContactGroupPage;
