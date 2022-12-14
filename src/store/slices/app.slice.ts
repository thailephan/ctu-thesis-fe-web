import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import Helpers from "../../common/helpers";
import {apiService} from "../../services";
import {updateAuth} from "./auth.slice";
import {IUser, IChannel, IFriend, ISentInvitation, IReceivedInvitation} from "../../common/interface";
import {socket} from "../../components/socket";

type NotificationType = "ok" | "error" | "warning" | "default";

export interface AppState {
    isPageLoading: boolean,
    channels: IChannel[],
    groups: IChannel[],
    friends: IFriend[],
    users: IUser[],
    sentInvitations: ISentInvitation[],
    receivedInvitations: IReceivedInvitation[],
    notification: {
        content: any,
        duration: number,
        type: NotificationType,
    },
}

const initialState: AppState = {
    isPageLoading: false,
    channels: [],
    groups: [],
    friends: [],
    users: [],
    sentInvitations: [],
    receivedInvitations: [],
    notification: {
        content: null,
        duration: 5000,
        type: "default"
    },
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
            console.log("result", result);
            if (result.data.success) {
                return successCase;
            } else {
                return failedCase;
            }
        } catch (e) {
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
    } catch (e: any) {
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
        console.log(result);
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
            path: "/channels/getAllWithEmptyMessageChannel",
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
});

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
        },
        acceptFriendInvitation: (state, action: PayloadAction<{senderId: number}>) => {
            socket.emit("invitation/accept", { senderId: action.payload.senderId });
        },
        rejectFriendInvitation: (state, action: PayloadAction<{ senderId: number }>) => {
            socket.emit("invitation/reject", { senderId: action.payload.senderId });
        },

        showNotification: (state, action: PayloadAction<{content: any, duration?: number, type?: NotificationType}>) => {
            state.notification.content = action.payload.content;
            state.notification.type = action.payload.type || "default";
            state.notification.duration = action.payload.duration || state.notification.duration;
        },
        hideNotification: (state) => {
            state.notification.content = null;
            state.notification.type = "default";
            state.notification.duration = 3000;
        },

        resetAppState: (state) => {
            state.isPageLoading = false;
            state.channels = [];
            state.groups = [];
            state.friends = [];
            state.users = [];
            state.sentInvitations = [];
            state.receivedInvitations = [];
            state.notification = {
                content: null,
                duration: 5000,
                type: "default"
            };
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
                // localStorage.setItem("friends", JSON.stringify(action.payload));
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
                // localStorage.setItem("channels", JSON.stringify(action.payload));
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
                // console.log(action.payload);
                state.groups = action.payload || [];
                // localStorage.setItem("groups", JSON.stringify(action.payload));
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
                // console.log(action.payload);
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
    cancelInvitation, removeSentInvitation, acceptFriendInvitation,
    showNotification, hideNotification,
    resetAppState, rejectFriendInvitation,
} = appSlice.actions

export default appSlice.reducer
