import React from 'react';
import { useLocation, Outlet, Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Box, Button } from "grommet";
import Screens from "../../common/screens";

function ContactPage() {
    const location = useLocation();

    return (<Box pad="medium" background="light-3" className="h-100 align-items-center">
        <Box pad="medium" className="justify-content-center align-items-center gap-3">
            <Card pad="medium" width="large" background="light-1">
                <CardHeader>
                    <Box  className="flex-row gap-2 justify-content-start">
                        {contactTypes.map(type => (
                            <Link to={type.path} key={type.path}><Button primary={location.pathname === type.path} className="px-3 p-2"
                                                         key={type.id}>{type.title}</Button></Link>
                        ))}
                    </Box>
                </CardHeader>
                <CardBody className="py-2 border-top my-2">
                    <Outlet/>
                </CardBody>
            </Card>
        </Box>
    </Box>);
}

export default ContactPage;

const contactTypes = [{
        id: 2,
        title: "Bạn bè",
        path: Screens.CONTACT,
    }, {
        id: 3,
        title: "Nhóm",
        path: Screens.CONTACT_GROUP,
    }, {
        id: 4,
        title: "Lời mời kết bạn",
        path: Screens.CONTACT_INVITATIONS,
    }, ];