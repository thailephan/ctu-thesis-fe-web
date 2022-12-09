import React from 'react';
import { Button, Box, Card, CardHeader, CardBody } from "grommet";
import { Link, useLocation, Outlet } from 'react-router-dom';
import Screens from "../../common/screens";

function AccountPage() {
    const location = useLocation();

    return (<Box pad="medium" background="light-3" className="h-100 align-items-center">
        <Box pad="medium" className="justify-content-center align-items-center gap-3">
            <Card pad="medium" width="large" background="light-1">
                <CardHeader className="overflow-auto border-bottom py-3">
                    <Box className="flex-row gap-2 justify-content-start overflow-auto">
                        <Link to={Screens.ACCOUNT}><Button  primary={Screens.ACCOUNT === location.pathname} className="px-3 py-2">Thông tin người dùng</Button></Link>
                        <Link to={Screens.CHANGE_PASSWORD}><Button primary={Screens.CHANGE_PASSWORD === location.pathname} className="px-3 py-2">Đổi mật khẩu</Button></Link>
                        <Link to={Screens.ACCOUNT_SETTING}><Button primary={Screens.ACCOUNT_SETTING === location.pathname} className="px-3 py-2">Cài đặt</Button></Link>
                    </Box>
                </CardHeader>
                <CardBody className="py-3">
                    <Outlet/>
                </CardBody>
            </Card>
        </Box>
    </Box>);
}

export default AccountPage;