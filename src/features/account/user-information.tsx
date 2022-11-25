import React, {useState, useRef, useEffect} from 'react';
import { Button, Form, Box, Text, RadioButtonGroup, Stack } from "grommet";
import { Edit, Trash, Save } from "grommet-icons";
import Helpers from "../../common/helpers";
import { TextInput, Tip, Avatar, DateInput } from "../../components";
import {useAppDispatch, useAppSelector} from "../../store";
import { format, getUnixTime, subYears, startOfYear} from 'date-fns';
import {loadUserData, updateUserAvatar} from "../../store/slices/auth.slice";
import Constants from "../../common/constants";
import {hidePageLoading, showPageLoading} from "../../store/slices/app.slice";
import {apiService, assetService} from "../../services";
import {socket} from "../../components/socket";

// NOTE: Package not support for `0` value so change "Male" to 2 in client and remap to 0 when submit to server
function UserInformationPage() {
    const avatarInputRef = useRef<any>();
    const [isEdit, setIsEdit] = useState(false);

    const { user = {} } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
       dispatch(loadUserData());
    }, [])

    // console.log(user.birthday, user.birthday && format(new user.birthday * 1000, "dd/MM/yyyy"));

    const _onSubmit = async (e: any) => {
        console.log(e.value.birthday, getUnixTime(new Date(e.value.birthday)));
        const formValue = {
            ...user,
            ...e.value,
            email: user.email,
            birthday: e.value.birthday ? getUnixTime(new Date(e.value.birthday)) : undefined,
            gender: e.value.gender && e.value.gender ===  1 ? 1 : 0
        };
        const result = await apiService.Post({
            path: "/users/update",
            data: formValue,
        })
        if (result.data.success) {
            socket.emit("user/updateInformation", user);
            dispatch(loadUserData());
        } else {
            alert("Đã có lỗi xảy ra");
        }
        setIsEdit(false);
    }

    const _renderEditForm = () => {
        return (
            <Form onSubmit={_onSubmit} className="d-flex flex-column gap-3 overflow-auto">
                <Box className="flex-row justify-content-end gap-1">
                    <Tip title="Lưu thay đổi" dropProps={{
                        align: { bottom: "top", }
                    }}>
                        <Button primary type="submit" icon={<Save/>} />
                    </Tip>
                    <Tip title="Hủy thay đổi" dropProps={{
                        align: { bottom: "top", }
                    }}>
                        <Button primary type="reset" icon={<Trash/>} onClick={_cancelEdit}/>
                    </Tip>
                </Box>
                <TextInput
                    formFieldProps={{
                        disabled: true,
                    }}
                    label="Email"
                    placeholder="Email"
                    name="email"
                    textInputProps={{
                        defaultValue: user.email,
                        disabled: true,
                    }}
                />
                <TextInput
                    label="Họ và tên"
                    placeholder="Nhập họ và tên"
                    name="fullName"
                    textInputProps={{
                        defaultValue: user.fullName
                    }}
                    formFieldProps={{
                        // validate: [(fieldValue: string) => fieldValue?.length > 0 && ([
                        //     {
                        //         regexp: Constants.RegExp.TEXT_WITHOUT_WHITESPACE_START_OR_END,
                        //         message: "Trường không chứa khoảng trắng ở cuối",
                        //         status: "error",
                        //     }, {
                        //         regexp: Constants.RegExp.VIETNAMESE_TEXT_NO_SPACE,
                        //         message: "Trường chỉ gồm số hoặc ký tự",
                        //         status: "error",
                        //     },
                        // ]),]
                        validate: [(fieldValue: string) => (user.fullName || fieldValue?.length > 0) && !Constants.RegExp.TEXT_WITHOUT_WHITESPACE_START_OR_END.test(fieldValue) && (
                            {
                                message: "Trường không chứa khoảng trắng ở cuối",
                                status: "error",
                            }
                        ), (fieldValue: string) => (user.fullName || fieldValue?.length > 0) && !Constants.RegExp.VIETNAMESE_TEXT_NO_SPACE.test(fieldValue) && (
                            {
                                message: 'Trường chỉ gồm số, ký tự, gạch ngang ("-") hoặc khoảng trắng',
                                status: "error",
                            }
                        )]
                    }}
                />
                <DateInput
                    name="birthday"
                    value={user.birthday}
                    title="Ngày sinh"
                    max={new Date()}
                    min={startOfYear(subYears(new Date(), 40))}
                />
                <TextInput
                    label="Số điện thoại"
                    placeholder="0XXXXXXXXX"
                    name="phoneNumber"
                    textInputProps={{
                        defaultValue: user.phoneNumber
                    }}
                    formFieldProps={{
                        // validate: [{
                        //     regexp: /^0.*$/,
                        //     message: "Số điện thoại bắt đầu bằng số 0",
                        //     status: "error",
                        // },{
                        //     regexp: /^0\d{9}$/,
                        //     message: "Phải gồm 10 chữ số, không chứa khoảng trắng",
                        //     status: "error",
                        // },],
                        validate: [(fieldValue: string) => (user.phoneNumber || fieldValue.length > 0) && !/^0.*$/.test(fieldValue) && ({
                            message: "Số điện thoại bắt đầu bằng số 0",
                            status: "error",
                        }), (fieldValue: string) => (user.phoneNumber || fieldValue.length > 0) && !/^0\d{9}$/.test(fieldValue) && ({
                            message: "Phải gồm 10 chữ số, không chứa khoảng trắng",
                            status: "error",
                        }),],
                        defaultValue: user.phoneNumber,
                    }}
                />
                <Box className="gap-3 justify-content-between">
                    <Text>Giới tính</Text>
                    <Box className="flex-row">
                        <RadioButtonGroup
                            name="gender"
                            className="d-flex flex-row gap-3"
                            options={[{
                                id: "001",
                                label: "Nam",
                                value: 2
                            }, {
                                id: "002",
                                label: "Nữ",
                                value: 1
                            }, ]}
                            defaultValue={user.gender === 0 ? 2 : user.gender}
                        />
                    </Box>
                </Box>
            </Form>
        );
    }
    const _renderDataForm = () => {
        const genderText = user.gender === 0 ? "Nam" : (user.gender === 1) ? "Nữ" : "Không";
        return (
            <Box className="d-flex gap-3 flex-column mt-4">
                <Box className="flex-row justify-content-end gap-1">
                    <Tip title="Cập nhật" dropProps={{
                        align: {"bottom": "top"}
                    }}>
                        <Button primary icon={<Edit/>} onClick={_edit}/>
                    </Tip>
                </Box>
                <Box className="flex-row gap-3 justify-content-between">
                    <Text weight="bold">Email</Text>
                    {(user.email) ? <Text>{user.email}</Text> : <Text>Không có</Text>}
                </Box>
                <Box className="flex-row gap-3 justify-content-between">
                    <Text weight="bold" className="col-4">Họ và tên</Text>
                    {user.fullName ? <Text>{user.fullName}</Text> : <Text>Không có</Text>}
                </Box>
                <Box className="flex-row gap-3 justify-content-between">
                    <Text weight="bold">Ngày sinh</Text>
                    {(user.birthday) ? <Text>{format(user.birthday * 1000, "dd/MM/yyyy")}</Text> : <Text>Không có</Text>}
                </Box>
                <Box className="flex-row gap-3 justify-content-between">
                    <Text weight="bold">Số điện thoại</Text>
                    {user.phoneNumber ? <Text>{user.phoneNumber}</Text> : <Text>Không có</Text>}
                </Box>
                <Box className="flex-row gap-3 justify-content-between">
                    <Text weight="bold">Giới tính</Text>
                    {!Helpers.isNullOrEmpty(user.gender) &&  user?.gender! >= 0 ? <Text>{genderText}</Text> : <Text>Không có</Text>}
                </Box>
            </Box>
        );
    }

    const _edit = () => {
        setIsEdit(true);
    }
    const _cancelEdit = () => {
        setIsEdit(false);
    }

    const onChangeUserAvatar: React.ChangeEventHandler<HTMLInputElement> = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
           return;
        }
        const fileNameSplitor = e.target.value.split(".");
        const fileExt = fileNameSplitor[fileNameSplitor.length - 1];
        if (['jpeg', "jpg", "png"].every(v => v !== fileExt)) {
            alert("Chỉ được chọn ảnh có đuôi jpg, jpeg hoặc png");
        } else if (confirm("Xác nhận cập nhật ảnh đại diện không?")) {
            let formData = new FormData();

            formData.set("file", e.target.files![0]);

            try {
                dispatch(showPageLoading());
                const result = await assetService.PostFormData({
                    path: "/users/upload-avatar",
                    data: formData,
                })

                if (result.data.success) {
                    const avatarUrl = result.data.data;
                    const uploadImageResult = await apiService.Post({
                        path: "/users/updateAvatar",
                        data: {
                            avatarUrl,
                        },
                    })

                    if (uploadImageResult.data.success) {
                        socket.emit("user/updateAvatar", ({avatarUrl}));
                        dispatch(updateUserAvatar(avatarUrl));
                        alert("Cập nhật ảnh đại diện thành công");
                    } else {
                        alert("Đã có lỗi xảy ra");
                    }
                } else {
                    alert("Đã có lỗi xảy ra");
                }
            } catch (e) {
                alert("Đã có lỗi xảy ra");
                console.log("onChangeUserAvatar", e)
            } finally {
                dispatch(hidePageLoading());
            }
        }
        avatarInputRef.current.value = "";
    }

    return (<>
        <Box className="flex-row justify-content-center">
            <Stack anchor="bottom-right">
                <Avatar src={user.avatarUrl} avatarProps={{
                    size: "xlarge",
                }}/>
                <Box
                    background="light-1"
                    round
                    className="border"
                >
                    <Tip title='Cập nhật ảnh đại diện'>
                        <Button onClick={() => avatarInputRef?.current?.click()} icon={<Edit size="small" />} />
                    </Tip>
                </Box>
            </Stack>
        </Box>
        {isEdit ? _renderEditForm() : _renderDataForm()}

        <input type="file" id="upload-image" name="upload-image"
               ref={avatarInputRef}
               hidden
               onChange={onChangeUserAvatar}
               accept="image/png, image/jpeg" className="position-absolute w-100 h-100 opacity-0" />
    </>)
}

export default UserInformationPage;