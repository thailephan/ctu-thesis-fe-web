import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import Helpers from "../../common/helpers";
import {apiService} from "../../services";
import {updateAuth} from "./auth.slice";
import {IUser, IChannel, IFriend, ISentInvitation, IReceivedInvitation} from "../../common/interface";
import {socket} from "../../components/socket";

export interface AppState {
    isPageLoading: boolean,
    channels: IChannel[],
    groups: IChannel[],
    friends: IFriend[],
    users: IUser[],
    sentInvitations: ISentInvitation[],
    receivedInvitations: IReceivedInvitation[],
}

const initialState: AppState = {
    isPageLoading: false,
    channels: [],
    groups: [],
    friends: [],
    users: [],
    sentInvitations: [],
    receivedInvitations: [],
}

const verifyToken = async () => {
    const accessToken = localStorage.getItem("token");
    const failedCase = { isValid: false, accessToken: null};
    const successCase = { isValid: true, accessToken};

    if (!Helpers.isNullOrEmpty(accessToken)) {
        // TODO: check token validate
        try {
            const result = await apiService.Post({
                path: "/auth/verifyToken",
            })
            if (result.data.success) {
                return successCase;
            } else {
                return failedCase;
            }
        } catch (e) {
            localStorage.removeItem("token");
            return failedCase;
        }
    }
    return failedCase;
}
export const init = createAsyncThunk("app/init", async (params, thunkAPI) => {
    const failedCase =  { accessToken: "", user: null};

    try {
        const { isValid, accessToken } = await verifyToken();
        if (isValid) {
            await thunkAPI.dispatch(updateAuth(accessToken));
        } else {
            localStorage.clear();
        }
    } catch (e) {
        localStorage.clear();
        return failedCase;
    }
});
export const loadUserFriends = createAsyncThunk<IFriend[]>("app/loadUserFriends", async (params, thunkAPI) => {
    // Get data from local (cache)
    // const localFriendJson = localStorage.getItem("friends");
    // if (!!localFriendJson) {
    //     const localFriends = JSON.parse(localFriendJson);
    //     return localFriends;
    // }
    //
    // Not found local data
    const failedCase: IFriend[] =  [];

    try {
        const result = await apiService.Get({
            path: "/friends/getAll",
        });
        if (result.data.success) {
            return result.data.data;
        } else {
            return failedCase;
        }
    } catch (e) {
        return failedCase;
    }
});
export const loadUserChannels = createAsyncThunk<IChannel[]>("app/loadUserChannels", async (params, thunkAPI) => {
    // Get data from local (cache)
    // const localChannelsJson = localStorage.getItem("channels");
    // if (!!localChannelsJson) {
    //     const localChannels = JSON.parse(localChannelsJson);
    //     return localChannels;
    // }
    //
    // Not found local data
    const failedCase: IChannel[] =  [];

    try {
        const result = await apiService.Get({
            path: "/channels/getAll",
        });
        if (result.data.success) {
            return result.data.data;
        } else {
            return failedCase;
        }
    } catch (e) {
        return failedCase;
    }
})
export const loadGroupChats = createAsyncThunk<IChannel[]>("app/loadGroupChat", async (params, thunkAPI) => {
    // Get data from local (cache)
    // const localChannelsJson = localStorage.getItem("channels");
    // if (!!localChannelsJson) {
    //     const localChannels = JSON.parse(localChannelsJson);
    //     return localChannels;
    // }
    //
    // Not found local data
    const failedCase: IChannel[] =  [];

    try {
        const result = await apiService.Get({
            path: "/channels/getAllGroupChannels",
        });
        if (result.data.success) {
            return result.data.data;
        } else {
            return failedCase;
        }
    } catch (e) {
        return failedCase;
    }
})

export const loadInvitations = createAsyncThunk<{sent: ISentInvitation[], received: IReceivedInvitation[]}>("app/loadInvitations", async (params, thunkAPI) => {
    // Get data from local (cache)
    // const localChannelsJson = localStorage.getItem("channels");
    // if (!!localChannelsJson) {
    //     const localChannels = JSON.parse(localChannelsJson);
    //     return localChannels;
    // }
    //
    // Not found local data
    const failedCase: {sent: ISentInvitation[], received: IReceivedInvitation[]} =  { sent: [], received: []};
    const successCase: any = {sent: [], received: []};
    try {
        const result = await Promise.all([apiService.Get({
            path: "/invitations/getAllSent",
        }), apiService.Get({
            path: "/invitations/getAllReceived",
        }), ]);
        if (result[0].data.success) {
            successCase.sent = result[0].data.data;
        }
        if (result[1].data.success) {
            successCase.received = result[1].data.data;
        }
        return successCase
    } catch (e) {
        return failedCase;
    }
})

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        /* PAGE LOADING */
        showPageLoading: (state) => {
            state.isPageLoading = true;
        },
        hidePageLoading: (state) => {
            state.isPageLoading = false;
        },

        /* FRIENDS */
        /* INVITATIONS */
        cancelInvitation: (state, action: PayloadAction<number>) => {
            const userId = action.payload;
            socket.emit("invitation/cancel", { receiverId: userId });
        },
        removeSentInvitation: (state, action: PayloadAction<number>) => {
            state.sentInvitations = state.sentInvitations.filter(s => s.receiverId !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            /* APP */
            .addCase(init.pending, (state) => {
                state.isPageLoading = true;
            })
            .addCase(init.fulfilled, (state) => {
                state.isPageLoading = false;
            })
            .addCase(init.rejected, (state) => {
                state.isPageLoading = false;
            })

            /* FRIENDS */
            .addCase(loadUserFriends.pending, (state) => {
                state.isPageLoading = true;
            })
            .addCase(loadUserFriends.fulfilled, (state, action: any) => {
                state.isPageLoading = false;
                state.friends = action.payload || [];
                localStorage.setItem("friends", JSON.stringify(action.payload));
            })
            .addCase(loadUserFriends.rejected, (state) => {
                state.isPageLoading = false;
            })

            /* USERS */
            .addCase(loadUserChannels.pending, (state) => {
                state.isPageLoading = true;
            })
            .addCase(loadUserChannels.fulfilled, (state, action: any) => {
                state.isPageLoading = false;
                console.log(action.payload);
                state.channels = action.payload || [];
                localStorage.setItem("channels", JSON.stringify(action.payload));
            })
            .addCase(loadUserChannels.rejected, (state) => {
                state.isPageLoading = false;
            })

            /* GROUPS */
            .addCase(loadGroupChats.pending, (state) => {
                state.isPageLoading = true;
            })
            .addCase(loadGroupChats.fulfilled, (state, action: any) => {
                state.isPageLoading = false;
                console.log(action.payload);
                state.groups = action.payload || [];
                localStorage.setItem("groups", JSON.stringify(action.payload));
            })
            .addCase(loadGroupChats.rejected, (state) => {
                state.isPageLoading = false;
            })

            /* INVITATIONS */
            .addCase(loadInvitations.pending, (state) => {
                state.isPageLoading = true;
            })
            .addCase(loadInvitations.fulfilled, (state, action: any) => {
                state.isPageLoading = false;
                console.log(action.payload);
                state.sentInvitations = action.payload.sent || [];
                state.receivedInvitations = action.payload.received || [];
            })
            .addCase(loadInvitations.rejected, (state) => {
                state.isPageLoading = false;
            })
    }
})

export const {
    showPageLoading, hidePageLoading,
    cancelInvitation, removeSentInvitation
} = appSlice.actions

export default appSlice.reducer
