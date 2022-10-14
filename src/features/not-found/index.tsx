import React from 'react';
import {Button} from "antd";
import HomeFilled from '@ant-design/icons/lib/icons/HomeFilled';
import { Link } from 'react-router-dom';
import Screens from '../../common/screens';

import "./styles.scss";

function NotFoundPage() {
    return (
        <div className="d-flex align-items-center justify-content-center flex-column w-100" style={{
            height: 100
        }}>
            <span className="h2">404</span>
            <span className="not-found-description">Đã có lỗi xảy ra</span>
            <Link to={Screens.HOME}><Button type="primary"><HomeFilled/> Trở về trang chủ</Button></Link>
        </div>
    );
}

export default NotFoundPage;