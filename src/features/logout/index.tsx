import React, { useEffect } from 'react';
import { useAppDispatch } from "../../store";
import {signout} from "../../store/slices/auth.slice";
import Screens from "../../common/screens";
import { useNavigate } from "react-router-dom";

// TODO: Clear access token and redirect back to signin page
function LogoutPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(signout());
            navigate(Screens.HOME);
        };
    }, [])

    return (
        <div></div>
    );
}

export default LogoutPage;