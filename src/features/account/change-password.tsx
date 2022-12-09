import React, { useState } from 'react';
import { Button, Form, FormExtendedEvent } from "grommet";
import { Hide, FormView, } from "grommet-icons";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../../components";
import {useAppDispatch, useAppSelector} from "../../store";
import {apiService} from "../../services";
import {showNotification} from "../../store/slices/app.slice";
import Screens from "../../common/screens";

// Change password, delete account
export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const _onSubmit = async (e: FormExtendedEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const result = await apiService.Post({
                path: "/users/changePassword",
                data: e.value,
            });
            if (result.data.success) {
                dispatch(showNotification({
                    content: "Đổi mật khẩu thành công",
                    type: "ok",
                }));
                navigate(Screens.ACCOUNT);
            } else {
                dispatch(showNotification({
                    content: result.data.message,
                    type: "error",
                }));
            }
        } catch (e) {
            console.log(e);
            dispatch(showNotification({
                content: "Đã có lỗi xảy ra",
                type: "error",
            }));
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
