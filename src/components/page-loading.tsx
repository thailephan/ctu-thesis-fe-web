import React from 'react';
import { Box, Spinner } from "grommet";
import {useAppSelector} from "../store";

function PageLoading() {
    const isPageLoading = useAppSelector((state) => state.app.isPageLoading);

    return isPageLoading ? (
        <Box className="position-absolute align-items-center justify-content-center w-100 h-100" style={{
            top: 0,
            right: 0,
            zIndex: 9999,
            background: "#FFFFFF77",
        }}>
            <Spinner size="large" />
        </Box>
    ) : <div></div>;
}

export default PageLoading;