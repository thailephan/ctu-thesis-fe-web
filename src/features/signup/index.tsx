import React, {useRef, useState} from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Heading, Text, Form,  Box, CheckBox } from "grommet";
import { FormView, Hide } from "grommet-icons";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse } from '@react-oauth/google';
import helpers from "../../common/helpers";
import Screens from "../../common/screens";
import { TextInput } from "../../components";

import axios from "axios";
import {useAppDispatch} from "../../store";
import {hidePageLoading, showNotification, showPageLoading} from "../../store/slices/app.slice";

interface IProps {

}

function SignUpPage(props: IProps) {
    const navigate = useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const dispatch = useAppDispatch();
    const registerRef = useRef<any>(null);
    const _onSubmit = async (e: any) => {
        e.preventDefault();
        dispatch(showPageLoading());
        const path = `http://localhost:4001/auth/${ registerRef?.current?.checked ? "registerMustActivate" : "register" }`;
        try {
            const result: any = await axios.post(path, {
                fullName: e.value.fullName,
                email: e.value.email,
                password: e.value.password,
            });

            dispatch(hidePageLoading());
            if (result.data.success) {
                if (registerRef.current.checked) {
                   dispatch(showNotification({
                       content: "Đăng ký tài khoản thành công. Vui lòng kiểm tra email để kích hoạt tài khoản",
                       type: "ok",
                   }));
                } else {
                    sessionStorage.setItem("token", result.data.accessToken);
                }
                navigate(Screens.HOME);
            } else {
                alert(result.data.message);
            }
        } catch (e) {
           alert("Đã có lỗi xảy ra");
            dispatch(hidePageLoading());
            console.error(e);
        }
    }

    // TODO: Handle login for sign up success with google (user register auth)
    const _onSignupSuccess = (credentials: CredentialResponse) => {
        const user = helpers.parseJwt(credentials.credential!);
        const data = {
            fullName: user.given_name,
            email: user.email,
        };
        // TODO: Call signup services
        console.log(data);
    }

    const _onSignupError = () => {
        alert("Đã có lỗi xảy ra");
    }

    return (
        <Box className="d-flex align-items-center justify-content-center" style={{
            minHeight: "100vh"
        }} background="light-6">
            <Card width="large" background="light-1">
                <CardHeader pad="medium">
                    <Heading margin="auto" level={3}>Đăng ký</Heading>
                </CardHeader>

                <CardBody pad="medium">
                    <div>
                        <Form onSubmit={_onSubmit} className="d-flex gap-3 flex-wrap flex-column">
                            <TextInput name="fullName" label="Họ và tên" placeholder="Nhập họ và tên" required />
                            <TextInput name="email" label="Email" placeholder="example@gmail.com" required formFieldProps={{
                                validate: [{
                                    regexp: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message: "Email không hợp lệ",
                                    status: "error"
                                }]
                            }} />
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
                                <Button primary className="py-2 px-3" type="submit">Đăng ký tài khoản</Button>
                                <div>
                                    <CheckBox ref={registerRef}/>
                                    <span>Phài xác thực</span>
                                </div>
                            </div>
                        </Form>
                    </div>
                    {/*<div className="d-flex flex-column align-items-center gap-2 border-top p-3 mt-3">*/}
                    {/*    <Text size="medium">*/}
                    {/*        Hoặc*/}
                    {/*    </Text>*/}
                    {/*    <GoogleLogin*/}
                    {/*        text="signup_with"*/}
                    {/*        onSuccess={_onSignupSuccess}*/}
                    {/*        onError={_onSignupError}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </CardBody>
                <CardFooter pad={{horizontal: "small"}} background="light-2">
                    <div className="d-flex flex-wrap justify-content-between align-items-center p-2 w-100">
                        <Text size="small">
                            Đã có tài khoản?&nbsp;
                            <Link to={Screens.SIGNIN}>
                                Đăng nhập
                            </Link>
                        </Text>
                    </div>
                </CardFooter>
            </Card>
        </Box>
    );
}

export default SignUpPage;