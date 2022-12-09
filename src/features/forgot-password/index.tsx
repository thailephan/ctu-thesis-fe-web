import React, {useState} from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Heading, Text, TextInput, Form, FormField, Box, Tip } from "grommet";
import { FormPreviousLink } from "grommet-icons";
import { Link, useNavigate } from "react-router-dom";
import Screens from "../../common/screens";

import {apiService} from "../../services";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [isSuccess, setIsSucess] = useState(false);

    const _onSubmit = async (e: any) => {
        e.preventDefault();
        // TODO: Call signup services
        const result = await apiService.Post({
            path: "/users/resetPassword",
            data: {
                email: e.value.email,
            }
        });

        if (result.data.success) {
            setIsSucess(true);
        } else {
            alert("Đã có lỗi xảy ra");
        }
    }

    const _backToLogin = () => {
        navigate(Screens.SIGNIN);
    }

    if (isSuccess) {
        return <Box className="d-flex align-items-center justify-content-center gap-2" style={{
            minHeight: "100vh"
        }} background="light-6">
            <Card width="large" background="light-1">
                <CardBody pad="medium" className="flex-column gap-2 align-items-center justify-content-center">
                    <Text size="large" color="status-ok">Yêu cầu đặt lại mật khẩu đã được gửi thành công.</Text>
                    <Text size="small">Vui lòng kiểm tra lại trong họp thư để hoàn thành quá trình đặt lại mật khẩu</Text>
                    <Button primary className="p-2 rounded" onClick={() => {navigate(Screens.HOME)}}>Về lại trang đăng nhập</Button>
                </CardBody>
            </Card>
        </Box>
    }

    return (
        <Box className="d-flex align-items-center justify-content-center gap-2" style={{
            minHeight: "100vh"
        }} background="light-6">
            <Card width="large" background="light-1">
                <Box className="px-4 pt-4">
                    <div>
                        <Tip content="Về trang đăng nhập">
                            <Button icon={<FormPreviousLink />} onClick={_backToLogin}/>
                        </Tip>
                    </div>
                </Box>
                <CardHeader pad="medium">
                    <Heading margin="auto" level={3}>Quên mật khẩu</Heading>
                </CardHeader>

                <CardBody pad="medium">
                    <div>
                        <Form onSubmit={_onSubmit} className="d-flex flex-wrap justify-content-between">
                            <FormField name="email" htmlFor="email" label="Email" validate={[{
                                regexp: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: "Email không hợp lệ",
                                status: "error"
                            }]} className="col-12 col-md-9 p-0">
                                <TextInput
                                    placeholder="abc@gmail.com"
                                    id="email" name="email"
                                />
                            </FormField>
                            <div className="d-flex flex-wrap justify-content-between align-items-center col-12 col-md-3 p-0">
                                <Button primary className="py-2 px-3" type="submit">Đặt lại mật khẩu</Button>
                            </div>
                        </Form>
                    </div>
                </CardBody>
                <CardFooter pad={{horizontal: "small"}} background="light-2">
                    <div className="d-flex flex-wrap justify-content-between align-items-center p-2 w-100">
                        <Text size="small">
                            <Link to={Screens.SIGNUP}>
                                Đăng ký tài khoản mới?&nbsp;
                            </Link>
                        </Text>
                    </div>
                </CardFooter>
            </Card>
        </Box>
    );
}

export default ForgotPasswordPage;
