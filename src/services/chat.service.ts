import { service } from "../config";
import Constants from "../common/constants";
import APIAccessor from "./APIAccessor";
import type { IAPIAccessor } from "../common/interface";

let instance: IAPIAccessor | null = null;

const getInstance = () => {
    if (instance === null) {
        // Create configuration for axios library
        const config = {
            baseURL: service.chatUrl,
            headers: {
                // "Access-Control-Allow-Origin": "*",
                // "Cache-Control": "no-cache",
                // "Content-Type": ContentType.JSON,
                // "Pragma": "no-cache",
                "Accept-Language": "vi"
            },
            // method: Method.GET,
            timeout: Constants.Api.TIMEOUT,
        };

        // Create an instance using the config defaults provided by the library
        return APIAccessor(config)
    }
    return instance;
}

export default getInstance();
