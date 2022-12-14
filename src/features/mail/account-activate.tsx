import React, {useEffect, useState} from 'react';
import Screens from "../../common/screens";
import { apiService } from '../../services';
import { Button, Card, Box, CardBody, Spinner } from 'grommet';
import {Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import {useAppDispatch} from "../../store";
import {showNotification} from "../../store/slices/app.slice";

function AccountActivatePage() {
    const navigate = useNavigate();
    const [searchParams, ] = useSearchParams();
    const [isCodeExpired, setIsCodeExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const code = searchParams.get("code");
    const [hasActivated, setHasActivated] = useState(false);
    const dispatch = useAppDispatch();
    if (!code) {
        return <Navigate to="/" replace />
    }

    useEffect(() => {
        async function init() {
            const result = await apiService.Get({
                path: `/validate-code/${code}`,
            });
            if (result.data.success) {
                const activateAccountResult = await apiService.Post({
                    path: "/users/activateAccount",
                    data: {
                        code,
                    }
                });

                if (activateAccountResult.data.success) {
                   dispatch(showNotification({
                       type: "ok",
                       content: "Kích hoạt thành công tài khoản. Vui lòng đăng nhập để tiếp tục",
                   }));
                   navigate(Screens.HOME);
                } else {
                    if (activateAccountResult.data.message === "Tài khoản đã được kích hoạt rồi") {
                        setHasActivated(true);
                        console.log(activateAccountResult.data.message);
                    } else {
                        console.log(activateAccountResult.data.message);
                        // dispatch(showNotification({
                        //     content: activateAccountResult.data.message,
                        //     type: "error",
                        // }));
                    }
                }
                setIsCodeExpired(false);
            } else {
                setIsCodeExpired(true);
                console.log(result.data.message);
            }
            setIsLoading(false);
        }
        init();
    }, [])

    let content = <div></div>;
    if (isLoading) {
        content = <Box className="w-100 align-items-center justify-content-center">
        <Spinner size="medium"/>
            </Box>
    } else {
        if (isCodeExpired) {
            content = <div className="p-2">
            <span>Link đã hết hạn. Vui lòng liên hệ với <a href="mailto:jpett612@gmail.com?subject=[ABC] Không thể kích hoạt tài khoản"><u>chúng tôi</u></a> đế có thêm thông tin chi tiết</span>
            </div>
        } else if (hasActivated) {
            content = <div className="p-2">
            <span>Tài khoản đã được kích hoạt rồi, vui lòng không tái kích hoạt tài khoản
                &nbsp;<Link to={Screens.HOME}><Button primary className="p-2 rounded">Về trang chủ</Button></Link>
                </span>
            </div>
        } else {
            content = <Box className="gap-2 align-items-center">
                <span> Kích hoạt tài khoản thành công. Vui lòng đăng nhập để tiếp tục</span>
                <Link to={Screens.HOME}><Button primary className="p-2 rounded"> Về trang chủ </Button></Link>
            </Box>
        }
    }

    return (<Box className="d-flex align-items-center justify-content-center gap-2" style={{
        minHeight: "100vh"
    }} background="light-6">
    <Card width="large" background="light-1" pad="medium">
    <CardBody>
        {content}
    </CardBody>
    </Card>
    </Box>);
}

export default AccountActivatePage;
