import { Box, Card, CardHeader, CardBody, DropButton } from 'grommet';
import React from 'react';
import { Outlet, Link } from "react-router-dom";
import {MainNavMenu, PageLoading, Avatar, Notification} from "../components";
import Screens from "../common/screens";
import {useAppSelector} from "../store";

function MainLayout() {
    const user = useAppSelector((state) => state.auth.user) || {};
    console.log("main layout reload");
    return (
        <Box className="d-flex flex-row position-relative" style={{
            minHeight: "100vh",
            minWidth: 625,
        }}>
            <Card round="none" className="p-2 py-3 gap-3 d-flex position-sticky top-0" style={{
                maxHeight: "100vh",
            }}>
                <CardHeader className="mb-3">
                    <DropButton
                        dropProps={{
                            align: {
                                "left": "right",
                                "top": "top"
                            },
                        }}
                        dropContent={
                            <Box className="shadow-sm" round="large">
                                <Box background="light-2" pad="small" className="gap-2">
                                    <Link to={Screens.ACCOUNT} className="p-2">Thông tin người dùng</Link>
                                    <Link to={Screens.LOGOUT} className="p-2">Đăng xuất</Link>
                                </Box>
                            </Box>
                        }
                    >
                        <Avatar src={user.avatarUrl} avatarProps={{
                            style: {
                                top: "50%",
                                right: "50%",
                                zIndex: 1,
                            }
                        }} />
                    </DropButton>
                </CardHeader>
                <CardBody className="gap-3">
                    <MainNavMenu />
                </CardBody>
            </Card>
            <Box className="w-100">
                <Outlet />
            </Box>
            <PageLoading />
            <Notification />
        </Box>
    );
}

export default MainLayout;