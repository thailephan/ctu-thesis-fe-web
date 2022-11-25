import React, {useState} from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Heading, Text, Form, Box } from "grommet";
import { FormView, Hide } from "grommet-icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import helpers from "../../common/helpers";
import Screens from "../../common/screens";
import { TextInput } from "../../components";

import { useAppDispatch } from "../../store";
import {updateAuth} from "../../store/slices/auth.slice";
import {hidePageLoading, showPageLoading} from "../../store/slices/app.slice";
import {apiService} from "../../services";

function SignInPage() {
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const dispatch = useAppDispatch();

    const _onSubmit = async (e: any) => {
        e.preventDefault();
        dispatch(showPageLoading());
        try {
            const result : any  = await apiService.Post({
                path: "/auth/login",
                data: {
                    email: e.value.email,
                    password: e.value.password,
                }
            })

            if (result.data.success) {
                dispatch(updateAuth(result.data.data.accessToken));
                navigate(Screens.HOME);
            } else {
                alert("Tài khoản hoặc mật khẩu không chính xác");
            }
            dispatch(hidePageLoading());
        } catch (e) {
            dispatch(hidePageLoading());
            alert("Đã có lỗi xảy ra");
            console.log(e);
        }
    }

    const _onSigninSuccess = async (credentials: CredentialResponse) => {
        const user = helpers.parseJwt(credentials.credential!);

        dispatch(showPageLoading());
        const result : any  = await apiService.Post({
            path: "/auth/login/google",
            data: {
                email: user.email,
            }
        })

        dispatch(hidePageLoading());

        if (result.data.success) {
            dispatch(updateAuth(result.data.data.accessToken));
            navigate(Screens.HOME);
        } else {
            alert("Đã có lỗi xảy ra");
        }
    }

    const _onSigninError = () => {
        alert("Đã có lỗi xảy ra");
    }

    return (
        <Box className="d-flex align-items-center justify-content-center" style={{
            minHeight: "100vh"
        }} background="light-6">
            <Card width="large" background="light-1">
                <CardHeader pad="medium">
                    <Heading margin="auto" level={3}>Đăng nhập</Heading>
                </CardHeader>

                <CardBody pad="medium">
                    <div>
                        <Form onSubmit={_onSubmit} className="d-flex gap-3 flex-wrap flex-column" onValidate={(e) => console.log(e)}>
                            <TextInput name="email" label="Email" required placeholder="example@gmail.com"
                                       formFieldProps={{
                                           validate: [{
                                               regexp: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                               message: "Email không hợp lệ",
                                               status: "error"
                                           }]
                                       }}
                                       textInputProps={{
                                           defaultValue: searchParams.get("email") || undefined,
                                       }}
                            />
                            <TextInput name="password" label="Mật khẩu" placeholder="Nhập mật khẩu" required
                                textInputProps={{
                                    type: isPasswordVisible ? "text": "password"
                                }}
                            />
                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                                { isPasswordVisible
                                    ? <Button className="py-2" onClick={() => setIsPasswordVisible(false)}><Hide /> Ẩn mật khẩu</Button>
                                    : <Button secondary className="py-2" onClick={() => setIsPasswordVisible(true)}><FormView /> Xem mật khẩu</Button>
                                }
                                <Button primary className="py-2 px-3" type="submit">Đăng nhập</Button>
                            </div>
                        </Form>
                    </div>
                    {/*<div className="d-flex flex-column align-items-center gap-2 border-top p-3 mt-3">*/}
                    {/*    <Text size="medium">*/}
                    {/*        Hoặc*/}
                    {/*    </Text>*/}
                    {/*    <GoogleLogin*/}
                    {/*        onSuccess={_onSigninSuccess}*/}
                    {/*        onError={_onSigninError}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </CardBody>
                <CardFooter pad={{horizontal: "small"}} background="light-2">
                    <div className="d-flex flex-wrap justify-content-between align-items-center p-2 w-100">
                        <Text size="small">
                            Chưa có tài khoản?&nbsp;
                            <Link to={Screens.SIGNUP}>Đăng ký</Link>
                        </Text>

                        <Text size="small">
                            <Link to={Screens.FORGOT_PASSWORD}>
                                Quên mật khẩu
                            </Link>
                        </Text>
                    </div>
                </CardFooter>
            </Card>
        </Box>
    );
}

export default SignInPage;
