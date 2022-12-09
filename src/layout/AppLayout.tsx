import React from 'react';
import { Outlet } from 'react-router-dom';
import {Notification, PageLoading} from "../components";

function AppLayout() {
    return (
        <>
            <Outlet />
            <Notification />
            <PageLoading />
        </>
    );
}

export default AppLayout;