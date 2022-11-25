import api from "./api.service";
import chat from "./chat.service";
import asset from "./asset.service";

export { api as apiService, chat as chatService,  asset as assetService };

const service = {
    api, chat, asset
}

export default service;