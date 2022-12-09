import React, {useEffect, useState} from 'react';
import { useAppDispatch } from "../../store";
import {signout} from "../../store/slices/auth.slice";
import Screens from "../../common/screens";
import { apiService } from '../../services';
import { TextInput } from '../../components';
import { Button, Form, Card, Box, CardBody, Heading, CardHeader, Spinner } from 'grommet';
import { Hide, FormView } from "grommet-icons";
import {Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

function ConfirmResetPassword() {
    const navigate = useNavigate();
    const [searchParams, ] = useSearchParams();
    const dispatch = useAppDispatch();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isCodeExpired, setIsCodeExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const code = searchParams.get("code");

    if (!code) {
        return <Navigate to="/" replace />
    }

    useEffect(() => {
        async function init() {
            const result = await apiService.Get({
                path: `/validate-code/${code}`,
            });
            if (result.data.success) {
                setIsCodeExpired(false);
            } else {
                setIsCodeExpired(true);
                console.log(result.data.message);
            }
            setIsLoading(false);
        }
        init();
    }, [])

    if (isLoading) {
        return <Box className="w-100 align-items-center justify-content-center">
            <Spinner size="medium"/>
        </Box>
    }

    if (isCodeExpired) {
        return <div className="p-2">
            <span>Link đã hết hạn. Vui lòng tắt link này và chọn
                &nbsp;<Link to={Screens.FORGOT_PASSWORD}><Button primary className="p-2 rounded">quên mật khẩu</Button></Link>
                &nbsp;để lấy link reset mật khẩu mới</span>
        </div>
    }

    const _onSubmit = async (e: any) => {
        try {
            const result = await apiService.Post({
                path: "/users/confirmResetPassword",
                data: {
                    ...e.value,
                    code
                },
            });
            if (result.data.success) {
                alert("Cập nhật mật khẩu thành công. Bạn sẽ được chuyển sang trang đăng nhập.");
                const redirectUrl = Screens.SIGNIN + "?email=" + result.data.data.email;
                dispatch(signout());
                navigate(redirectUrl, {
                    replace: true
                });
            } else {
                alert("Đã có lỗi xảy ra");
            }
        } catch (e) {
            console.log("Error")
        }
    }
    return (<Box className="d-flex align-items-center justify-content-center gap-2" style={{
            minHeight: "100vh"
        }} background="light-6">
            <Card width="large" background="light-1" pad="medium">
                <CardHeader>
                    <Heading level={3} className="mx-auto mb-3">Đặt lại mật khẩu</Heading>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={_onSubmit}>
                        <TextInput name="password" label="Mật khẩu" placeholder="Nhập mật khẩu" required
                                   textInputProps={{
                                       type: isPasswordVisible ? "text": "password"
                                   }}
                        />
                        <TextInput name="confirmPassword" label="Xác nhận mật khẩu" placeholder="Nhập xác nhận mật khẩu"
                                   required
                                   textInputProps={{
                                       type: isPasswordVisible ? "text" : "password"
                                   }}
                                   formFieldProps={{
                                       validate: (confirmPassword, formValue) => confirmPassword !== formValue.password
                                           && ({
                                               message: "Xác nhận mật khẩu không đúng",
                                               status: "error"
                                           })
                                   }}
                        />
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                            {isPasswordVisible
                                ? <Button className="py-2" onClick={() => setIsPasswordVisible(false)}><Hide /> Ẩn mật
                                    khẩu</Button>
                                : <Button secondary className="py-2"
                                          onClick={() => setIsPasswordVisible(true)}><FormView /> Xem mật khẩu</Button>
                            }
                            <Button primary className="py-2 px-3" type="submit">Đổi mật khẩu</Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </Box>);
}

export default ConfirmResetPassword;