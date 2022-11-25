import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import Helpers from "../../common/helpers";
import {apiService} from "../../services";
import {
    hidePageLoading,
    loadGroupChats,
    loadInvitations,
    loadUserChannels,
    loadUserFriends,
    showPageLoading
} from "./app.slice";

export interface AuthState {
    accessToken?: string;
    user?: User;
}

export interface User {
    id?: number;
    phoneNumber?: string;
    email?: string;
    fullName?: string;
    gender?: number;
    registerTypeId?: number;
    registerType?: string;
    birthday?: number;
    avatarUrl?: string;
    status?: number;
    onlineStatus?: number;
    lastOnlineTime?: number;
}

const initialState: AuthState = {
}

// export const validateToken = createAsyncThunk("auth/validateToken", async (params, thunkAPI) => {
//     const accessToken = localStorage.getItem("token");
//     if (!Helpers.isNullOrEmpty(accessToken)) {
//         // TODO: check token validate
//         try {
//             const result = await axios.post("http://localhost:4001/auth/verifyToken", null, {
//                 headers: {
//                     authorization: `bearer ${accessToken}`,
//                 },
//             });
//             if (result.data.success) {
//                 return accessToken;
//             } else {
//                 return "";
//             }
//         } catch (e) {
//             localStorage.removeItem("token");
//             return "";
//         }
//     }
//     return "";
// });
// export const loadUserData = async () => {
//     const accessToken = localStorage.getItem("token");
//     const failedCase = null;
//
//     if (!Helpers.isNullOrEmpty(accessToken)) {
//         // TODO: check token validate
//         try {
//             const result = await apiService.Post({
//                 path: "/users/userInformation",
//             })
//             if (result.data.success) {
//                 return result.data.data;
//             } else {
//                 return failedCase;
//             }
//         } catch (e) {
//             localStorage.removeItem("token");
//             return failedCase;
//         }
//     }
//     return failedCase;
// };

export const updateAuth = createAsyncThunk<{accessToken: string | null, user: any}, string | null>("auth/updateAuth",
    async (accessToken: string | null, thunkAPI) => {
    thunkAPI.dispatch(showPageLoading());
    const failedCase = {
        accessToken,
        user: null,
    };

    if (!Helpers.isNullOrEmpty(accessToken)) {
        // TODO: check token validate
        try {
            localStorage.clear();
            localStorage.setItem("token", accessToken!);
            const result = await apiService.Get({
                path: "/users/userInformation",
            })
            if (result.data.success) {
                thunkAPI.dispatch(loadUserChannels());
                thunkAPI.dispatch(loadUserFriends());
                thunkAPI.dispatch(loadGroupChats());
                thunkAPI.dispatch(loadInvitations());

                return {
                    accessToken,
                    user: result.data.data,
                };
            } else {
                return failedCase;
            }
        } catch (e) {
            thunkAPI.dispatch(hidePageLoading());
            localStorage.clear();
            return failedCase;
        }
    }
    thunkAPI.dispatch(hidePageLoading());
    return failedCase;
});
export const loadUserData = createAsyncThunk("auth/loadUserData",
    async (params, thunkAPI) => {
        thunkAPI.dispatch(showPageLoading());
        try {
            const result = await apiService.Get({
                path: "/users/userInformation",
            })
            thunkAPI.dispatch(hidePageLoading());
            if (result.data.success) {
                return result.data.data;
            } else {
                return null;
            }
        } catch (e) {
            thunkAPI.dispatch(hidePageLoading());
            return null;
        }
    });
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signout: (state) => {
            state.accessToken = undefined;
            state.user = undefined;
            localStorage.clear();
        },
        updateUserAvatar: (state, action: PayloadAction<string>) => {
            state.user!.avatarUrl = action.payload;
        },
        updateUserInformation: ((state, action: PayloadAction<any>) => {
           state.user = {...(state.user || {}), ...action.payload};
        })
    },
    extraReducers: (builder) => {
        builder.addCase(updateAuth.fulfilled, (state, action: any) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        }).addCase(loadUserData.fulfilled, (state, action: any) => {
            state.user = action.payload;
        });
    }
})

export const { signout, updateUserAvatar, updateUserInformation } = authSlice.actions

export default authSlice.reducer
