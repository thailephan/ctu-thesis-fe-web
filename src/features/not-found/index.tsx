import React from 'react';
import { Link } from 'react-router-dom';
import Screens from '../../common/screens';
import { Box, Heading, Button } from "grommet";

import "./styles.scss";

function NotFoundPage() {
    return (
        <Box className="w-100 align-items-center justify-content-center gap-4" style={{
            height: "100vh",
            maxHeight: "100vh"
        }}>
            <Box className="flex-row gap-2">
                <Heading color="brand" style={{ fontSize: "6rem" }}>4</Heading>
                <Heading color="brand" style={{ fontSize: "6rem" }}>0</Heading>
                <Heading color="brand" style={{ fontSize: "6rem" }}>4</Heading>
            </Box>
            <Button>
                <Link to={Screens.HOME}>Về trang chủ</Link>
            </Button>
        </Box>
        // <div className="d-flex align-items-center justify-content-center flex-column w-100" style={{
        //     height: 100
        // }}>
        //     <span className="h2">404</span>
        //     <span className="not-found-description">Đã có lỗi xảy ra</span>
        //     {/*<Link to={Screens.HOME}><Button type="primary"><HomeFilled/> Trở về trang chủ</Button></Link>*/}
        // </div>
    );
}

export default NotFoundPage;