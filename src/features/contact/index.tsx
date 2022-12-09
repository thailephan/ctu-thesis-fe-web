import React from 'react';
import { Search } from "grommet-icons";
import { useLocation, Outlet, Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Box, Button, Text } from "grommet";
import Screens from "../../common/screens";

function ContactPage() {
    const location = useLocation();

    return (<Box pad="medium" background="light-3" className="h-100 align-items-center">
        <Box pad="medium" className="justify-content-center align-items-center gap-3">
            <Card pad="medium" width="large" background="light-1">
                <CardHeader>
                    <Box className="flex-row">
                        {contactTypes.map(type => (
                            <Link to={type.path} key={type.path}><Button primary={location.pathname === type.path} className="px-3 p-2 rounded"
                                                                         key={type.id}>{type.title}</Button></Link>
                        ))}
                        <Link to={Screens.CONTACT_SEARCH}>
                            <Box background={location.pathname === Screens.CONTACT_SEARCH ? "brand" : undefined}
                                 className="px-3 p-2 rounded flex-row">
                                <Search/>
                                <Text>Thêm liên lạc</Text>
                            </Box>
                        </Link>
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
        id: 4,
        title: "Lời mời kết bạn",
        path: Screens.CONTACT_INVITATIONS,
    }, ];