import React, { useState } from 'react';
import { Button, Form } from "grommet";
import { Hide, FormView, } from "grommet-icons";
import Screens from "../../common/screens";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../../components";
import {signout} from "../../store/slices/auth.slice";
import {useAppDispatch, useAppSelector} from "../../store";
import {apiService} from "../../services";

// Change password, delete account
export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { user = {} } = useAppSelector(state => state.auth);

    const _onSubmit = async (e) => {
        // TODO: Call services to send email and get validate code
        // TODO: then insert code and call services check
        // Ok then logout user to relogin
        try {
            const result = await apiService.Post({
                path: "/users/changePassword",
                data: e.value,
            });
            if (result.data.success) {
                const redirectUrl = Screens.SIGNIN + "?email=" + user.email;
                dispatch(signout());
                navigate(redirectUrl);
            } else {
                alert("Đã có lỗi xảy ra");
            }
        } catch (e) {
            console.log("Error")
        }
    }
    return <>
        <Form onSubmit={_onSubmit}>
            <TextInput name="oldPassword" label="Mật khẩu cũ" placeholder="Nhập mật khẩu cũ" required
                       textInputProps={{
                           type: isPasswordVisible ? "text": "password"
                       }}
            />
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
                    ? <Button className="py-2" onClick={() => setIsPasswordVisible(false)}><Hide/> Ẩn mật
                        khẩu</Button>
                    : <Button secondary className="py-2"
                              onClick={() => setIsPasswordVisible(true)}><FormView/> Xem mật khẩu</Button>
                }
                <Button primary className="py-2 px-3" type="submit">Đổi mật khẩu</Button>
            </div>
        </Form>
    </>
}
