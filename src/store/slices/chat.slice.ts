import {createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {IMessage, IResult} from "../../common/interface";
import {apiService, assetService} from "../../services";
import {getMesasgeByChannel, saveMessage} from "../../common/indexdb";
import {socket} from "../../components/socket";
import {hidePageLoading, init, showPageLoading} from "./app.slice";
import {AuthState} from "./auth.slice";

export interface ChatState {
    replyForId: number | null;
    messages: {[key:number]: IMessage};
    hasUnread: {[key: number]: boolean};
    typingList: number[];
    selectedChatChannelId: number | null;
}

const initialState: ChatState = {
    replyForId: null,
    messages: {},
    hasUnread: {},
    typingList: [],
    selectedChatChannelId: null,
}
export const loadUsersChannelTyping = createAsyncThunk<number[], number | null>("chat/loadUsersChannelTyping", async (selectedChatChannelId, thunkAPI) => {
    const failedCase: number[] = [];
    if (selectedChatChannelId) {
        try {
            const result: IResult = await apiService.Get({
                path: `/channels/${selectedChatChannelId}/typing/getAll`
            });
            if (result.data.success) {
               return result.data.data.typingUsersId;
            }
            return failedCase;
        } catch (e) {
            return failedCase;
        }
    }
    return failedCase;
});
export const selectChatChannel = createAsyncThunk<{
        selectedChatChannelId: any,
        messages: {[key: number]: IMessage},
    }, number>("chat/selectChatChannel", async (channelId, thunkAPI) => {
    const newChannelId = channelId
    const result: {
        selectedChatChannelId: number,
        messages: {[key: number]: IMessage},
    } = {
        selectedChatChannelId: newChannelId,
        messages: {},
    };
    if (newChannelId) {
        socket.emit("chat/message/seen", { channelId: newChannelId });
        console.log("Oke 1");
        result.messages = await getMesasgeByChannel({ channelId: newChannelId })
    }
    return result;
})

export const addMessage = createAsyncThunk<any, { channelId: number, message: IMessage, emitterId: any }, { state: { chat:ChatState, auth: AuthState } }>("chat/addMessage",  async (params, thunkAPI) => {
    const { channelId, message, emitterId } = params;
    const state: ChatState = thunkAPI.getState().chat;
    const authState: AuthState = thunkAPI.getState().auth;
    const result: any = {};

    if (state.selectedChatChannelId === channelId) {
        result.hasUnread = {...state.hasUnread, [channelId]: false};
        result.messages = {...state.messages, [message.id]: message}
    } else {
        result.hasUnread = {...state.hasUnread, [channelId]: true};
    }
    await saveMessage(message);

    if (authState.user?.id !== emitterId) {
        console.log(channelId, state.selectedChatChannelId);
        if (channelId === state.selectedChatChannelId) {
            socket.emit("chat/message/seen", { channelId });
        } else {
            socket.emit("chat/message/received", { channelId });
        }
    }

    return result;
});

export const sendImageMessage = createAsyncThunk<any, { file: File }, { state: { chat: ChatState }}>("chat/sendImageMessage", async (params, thunkAPI) => {
    const fileNameSplitor = params.file.name.split(".");
    const fileExt = fileNameSplitor[fileNameSplitor.length - 1];
    if (['jpeg', "jpg", "png"].every(v => v !== fileExt)) {
        alert("Chỉ được chọn ảnh có đuôi jpg, jpeg hoặc png");
    } else {
        const state = thunkAPI.getState().chat;
        const formData = new FormData();

        formData.set("file", params.file);

        try {
            thunkAPI.dispatch(showPageLoading());
            const result = await assetService.PostFormData({
                path: "/messages/upload-attachments",
                data: formData,
            })

            if (result.data.success) {
                socket.emit('chat/message/send', {
                    message: result.data.data,
                    channelId: state.selectedChatChannelId,
                    messageTypeId: 2,
                    replyForId: state.replyForId
                });
            } else {
                alert("Đã có lỗi xảy ra");
                console.log("_sendImageMessage", result.data.message)
            }
        } catch (e) {
            alert("Đã có lỗi xảy ra");
            console.log("_sendImageMessage", e)
        } finally {
            thunkAPI.dispatch(hidePageLoading());
        }
    }
});
export const sendAttachmentMessage = createAsyncThunk<any, { file: File }, { state: { chat: ChatState } }>
    ("chat/sendAttachmentMessage", async (params, thunkAPI) => {
    const fileNameSplitor = params.file.name.split(".");
    const fileExt = fileNameSplitor[fileNameSplitor.length - 1];
    if (['jpeg', "jpg", "png"].every(v => v !== fileExt)) {
        alert("Chỉ được chọn ảnh có đuôi jpg, jpeg hoặc png");
    } else {
        const state = thunkAPI.getState().chat;
        const formData = new FormData();

        formData.set("file", params.file);

        try {
            thunkAPI.dispatch(showPageLoading());
            const result = await assetService.PostFormData({
                path: "/messages/upload-attachments",
                data: formData,
            })

            if (result.data.success) {
                socket.emit('chat/message/send', {
                    message: result.data.data,
                    channelId: state.selectedChatChannelId,
                    messageTypeId: 3,
                    replyForId: state.replyForId
                });
            } else {
                alert("Đã có lỗi xảy ra");
                console.log("_sendAttachmentMessage", result.data.message);
            }
        } catch (e) {
            alert("Đã có lỗi xảy ra");
            console.log("_sendAttachmentMessage", e)
        } finally {
            thunkAPI.dispatch(hidePageLoading());
        }
    }
})


export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        /* REPLY FOR MESSAGE */
        setReplyFor: (state, action: PayloadAction<number>) => {
            state.replyForId = action.payload;
        },
        resetReplyFor: (state) => {
            state.replyForId = null;
        },

        /* MESSAGE */
        loadLocalMessage: (state, action: PayloadAction<number>) => {
        },
        // addMessage: (state, action: PayloadAction<{channelId: number, message: IMessage}>) => {
        //     const { channelId, message} = action.payload;
        //     if (state.selectedChatChannelId === channelId) {
        //         //    TODO: Update state + save to db
        //         state.hasUnread = {...state.hasUnread, [channelId]: false};
        //         // state.messages = [...state.messages, message].sort((a, b) => a.id - b.id || 1);
        //         state.messages = {...state.messages, [message.id]: message}
        //     } else {
        //         //    TODO: Save to db and update hasUnread of channel to true
        //         state.hasUnread = {...state.hasUnread, [channelId]: true};
        //     }
        // },
        sendChatMessage: (state, action) => {
            const message = action.payload.message;
            console.log(message);
            socket.emit('chat/message/send', {
                message:  message,
                channelId: state.selectedChatChannelId,
                messageTypeId: 1,
                replyForId: state.replyForId
            });

            state.replyForId = null;
        },
        deleteMessage: (state, action: PayloadAction<number[]>) => {
        },
        clearAllMessages: (state) => {
        },

        /* CHANNEL */
        // TODO: Current unused
        selectChatChannel: (state, action: PayloadAction<number>) => {
            const newChannelId = action.payload
            state.selectedChatChannelId = newChannelId;
            if (newChannelId) {
                // const channelHasUnreadMesasge = JSON.parse(localStorage.getItem("unread") || "[]");
                // const map = new Map<number, boolean>(channelHasUnreadMesasge);
                // map.set(newChannelId, false);
                // localStorage.setItem("unread", JSON.stringify(Array.from(map)));
            }
        },
        deSelectChatChannel: (state) => {
            state.selectedChatChannelId = null;
        },

        /* TYPING */
        updateTypingList: (state, action: PayloadAction<{typingList: number[], channelId: number}>) => {
            if (state.selectedChatChannelId === action.payload.channelId) {
                state.typingList = action.payload.typingList;
            }
        },

        resetChatState: (state) => {
            state.selectedChatChannelId = null;
            state.replyForId = null;
            state.messages = {};
            state.hasUnread = {};
            state.typingList = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUsersChannelTyping.fulfilled, (state, action: any) => {
                state.typingList = action.payload;
            })
            .addCase(selectChatChannel.fulfilled, (state, action) => {
                state.selectedChatChannelId = action.payload.selectedChatChannelId;
                state.messages = action.payload.messages;
            })
            .addCase(addMessage.fulfilled, (state, action) => {
                state.messages = action.payload.messages;
                state.hasUnread = action.payload.hasUnread;
            })

            .addCase(sendImageMessage.fulfilled, (state, action) => {
                state.replyForId = null;
            })
    }
})

export const {
    setReplyFor, resetReplyFor,
    loadLocalMessage, deleteMessage, clearAllMessages, sendChatMessage,
    deSelectChatChannel,
    updateTypingList,
    resetChatState,
} = chatSlice.actions

export default chatSlice.reducer
