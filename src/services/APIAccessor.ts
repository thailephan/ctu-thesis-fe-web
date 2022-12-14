import axios from "axios";
import Constants from "../common/constants";
import Helpers from "../common/helpers";
import { IConfiguration, IResponse, IResult, IError, IRequest, Method, ContentType } from "../common/interface";
const __DEV__ = false;

const APIAccessor = (config: IConfiguration, httpClient: any = axios.create()) => {
    /**
     * Call api with POST method, using to upload file to server.
     *
     * @param {IRequest} request Request
     */
    const PostFormData = (request: IRequest): Promise<IResult> => {
        request.method = Method.POST;
        request.contentType = ContentType.FORM_DATA;
        return new Promise((resolve, reject) => {
            request.onSuccess = (result: IResult) => {
                resolve(result);
            };
            request.onError = (error: IError) => {
                reject(error);
            };
            _fetch(request);
        });
    }

    /**
     * Call api with POST method.
     *
     * @param {IRequest} request Request
     */
    const Post = (request: IRequest): Promise<IResult> => {
        request.method = Method.POST;
        return new Promise((resolve, reject) => {
            request.onSuccess = (result: IResult) => {
                resolve(result);
            };
            request.onError = (error: IError) => {
                reject(error);
            };
            _fetch(request);
        });
    }

    /**
     * Call api with GET method.
     *
     * @param {IRequest} request Request
     */
    const Get = (request: IRequest): Promise<IResult> => {
        request.method = Method.GET;
        return new Promise((resolve, reject) => {
            request.onSuccess = (result: IResult) => {
                resolve(result);
            };
            request.onError = (error: IError) => {
                reject(error);
            };
            _fetch(request);
        });
    }

    /**
     * Call api with PUT method.
     *
     * @param {IRequest} request Request
     */
    const Put = (request: IRequest): Promise<IResult> => {
        request.method = Method.PUT;
        return new Promise((resolve, reject) => {
            request.onSuccess = (result: IResult) => {
                resolve(result);
            };
            request.onError = (error: IError) => {
                reject(error);
            };
            _fetch(request);
        });
    }

    /**
     * Call api with DELETE method.
     *
     * @param {IRequest} request Request
     */
    const Delete = (request: IRequest): Promise<IResult> => {
        request.method = Method.DELETE;
        return new Promise((resolve, reject) => {
            request.onSuccess = (result: IResult) => {
                resolve(result);
            };
            request.onError = (error: IError) => {
                reject(error);
            };
            _fetch(request);
        });
    }

    /**
     * Main function _fetching data from server.
     *
     * @param {IRequest} request Request.
     */
    const _fetch = async (request: IRequest) => {
        onBeforeCallback(request);
        // Validate token expired
        // const isChecking = GlobalState.isChecking;
        // if (isChecking !== "1") {
        //     const user = GlobalState.user || null;
        //     if (user !== null && isTokenExpired(user) === true) {
        //         GlobalState.setIsChecking("1");
        //         __EventEmitter.emit(Constants.EventName.TOKEN_EXPIRED);
        //         return;
        //     }
        // }

        // create config for each request
        const axiosConfig = await _createAxiosConfig(request);
        if (__DEV__) {
            console.log(axiosConfig);
            const {method, path, requestId} = request;
            console.log(`%c ${requestId} - #_fetch [${method}: ${path}] `, Constants.Styles.CONSOLE_LOG_START);
            console.log("  > config :", axiosConfig);
        }
        // request to server
        httpClient.request(axiosConfig).then((response: Response) => {
            onAfterCallback(request, response);
            onSuccessCallback(request, response);
        }).catch((error: any) => {
            const response = error ? error.response : null;
            onAfterCallback(request, response, error);
            onErrorCallback(request, response, error);
        });
    }

    /**
     * Create config for each request.
     *
     * @param {IRequest} request Request.
     */
    const _createAxiosConfig = async (request: IRequest): Promise<any> => {
        const axiosConfig = {
            ...config,
            method: request.method,
            url: request.path,
        };
        if (request.baseUrl) {
            axiosConfig.baseURL = request.baseUrl;
        }
        // timeout
        if (Helpers.isNumber(request.timeout)) {
            axiosConfig.timeout = request.timeout;
        }
        // query string
        if (!Helpers.isNullOrEmpty(request.query)) {
            axiosConfig.params = {...axiosConfig.params, ...request.query};
        }
        // data (IMPORTANT: not set data if method is GET)
        if (axiosConfig.method !== Method.GET) {
            axiosConfig.data = request.data;
            // authentication
            if (request.secure !== false) {
                // Add logic for authentication
                // add new secure to header or data or query string
            }
        }
        // headers
        if (!Helpers.isNullOrEmpty(request.contentType)) {
            axiosConfig.headers = {
                ...axiosConfig.headers,
                ["Content-Type"]: request.contentType
            };
        }
        // const user = GlobalState.user || null;
        // if (user !== null) {
        //     axiosConfig.headers = {
        //         ...axiosConfig.headers,
        //         ["Authorization"]: user.token_type + " " + user.access_token
        //     };
        // }
        const accessToken = localStorage.getItem("token");
        if (accessToken !== null) {
            axiosConfig.headers = {
                ...axiosConfig.headers,
                ["Authorization"]: "Bearer " + accessToken
            };
        }

        if (!Helpers.isNullOrEmpty(request.headers)) {
            axiosConfig.headers = {...axiosConfig.headers, ...request.headers};
        }
        return axiosConfig;
    }

    /**
     * Function execute before request to server.
     * Create request id and clientStartTime, using for monitoring and calculate request duration.
     *
     * @param {IRequest} request Request.
     */
    const onBeforeCallback = (request: IRequest) => {
        request.clientStartTime = Date.now();
        request.requestId = request.clientStartTime;
        /* if (__DEV__) {
            const { method, path, requestId } = request;
            const clientStartTime = Helpers.dateToString(request.clientStartTime,
                Strings.Common.MOMENT_DATETIME_FORMAT3);
            console.log(`%c ${requestId} - #onBeforeCallback [${method}: ${path}]: `
                + `clientStartTime=${clientStartTime} `, Constants.Styles.CONSOLE_LOG_PREPARE);
            console.log("  > request :", request);
        } */
    }

    /**
     * Function execute after received from server.
     *
     * @param {IRequest} request Request.
     * @param {IResponse} response Response
     * @param {any} error Error if has error, default is null
     */
    const onAfterCallback = (request: IRequest, response: IResponse, error: any = null) => {
        request.clientEndTime = Date.now();
        // if (__DEV__) {
        //     const { method, path, requestId } = request;
        //     const clientEndTime
        // = Helpers.dateToString(request.clientEndTime, Strings.Common.MOMENT_DATETIME_FORMAT3);
        //     const duration = `${request.clientEndTime - (request.clientStartTime || 0)}ms`;
        //     console.log(`%c ${requestId} - #onAfterCallback [${method}: ${path}]: `
        //         + `clientEndTime=${clientEndTime}, duration=${duration} `,
        //         (error ? Constants.Styles.CONSOLE_LOG_DONE_ERROR : Constants.Styles.CONSOLE_LOG_DONE_SUCCESS));
        // }
    }

    /**
     * Execute after end request if success
     *
     * @param {IRequest} request Request.
     * @param {IResponse} response Response
     */
    const onSuccessCallback = (request: IRequest, response: IResponse) => {
        const data = response.data;
        if (__DEV__) {
            const {method, path, requestId} = request;
            console.log(`%c ${requestId} - #onSuccessCallback [${method}: ${path}] `,
                Constants.Styles.CONSOLE_LOG_SUCCESS);
            console.log("  > request      :", request);
            console.log("  > response     :", response);
        }
        // TODO: check business status
        if (response.status === Constants.ApiCode.SUCCESS) {
            if (Helpers.isFunction(request.onSuccess)) {
                request.onSuccess({data, response});
            }
        } else {
            // const messages: any = Strings.Message;
            // const message = messages[data.code] || data.message || messages.NOT_DEFINE;
            const error = {
                code: response.status,
                // message
            };
            // if (!Helpers.isNullOrEmpty(data.code) && (data.code.indexOf("99") === 0)) {
            //     DeviceEventEmitter.emit(Constants.EventName.COMMON_ERROR, error);
            // }
            if (Helpers.isFunction(request.onError)) {
                request.onError(error);
            }
        }
    }

    /**
     * Execute after end request if error
     *
     * @param {IRequest} request Request.
     * @param {IResponse} response Response
     * @param {any} error Error
     */
    const onErrorCallback = (request: IRequest, response: IResponse, error: any) => {
        if (__DEV__) {
            const {method, path, requestId} = request;
            console.log(`%c ${requestId} - #onErrorCallback [${method}: ${path}] `, Constants.Styles.CONSOLE_LOG_ERROR);
            console.log("  > request  :", request);
            console.log("  > response :", response);
            console.log("  > error    :", error);
        }
        // Error handler
        if (error) {
            if (Helpers.isNullOrEmpty(error.code) && Helpers.isNullOrEmpty(error.response)) {
                // Error unknown network
                if ("NETWORK ERROR" === Helpers.trim(error.message).toUpperCase()) {
                    if (__DEV__) {
                        console.warn("#onErrorCallback: Error unknown network");
                    }
                    if (Helpers.isFunction(request.onError)) {
                        // swal("Không tìm thấy kết nối mạng !", { icon: "error" });
                        // const messages: any = Strings.Message;
                        request.onError({
                            code: Constants.ApiCode.UNKNOWN_NETWORK,
                            // message: messages[Constants.ApiCode.UNKNOWN_NETWORK]
                        } as IError);
                    }
                    return;
                }
            }

            // Error connection timeout
            if (error.code === "ECONNABORTED") {
                console.log("Kết nối không phản hồi, vui lòng thử lại sau !", "error");

                if (__DEV__) {
                    console.warn("#onErrorCallback: Error connection timeout");
                }
                if (Helpers.isFunction(request.onError)) {
                    // const messages: any = Strings.Message;
                    request.onError({
                        code: Constants.ApiCode.CONNECTION_TIMEOUT,
                        // message: messages[Constants.ApiCode.CONNECTION_TIMEOUT]
                    } as IError);
                }
                return;
            }

            if (response) {
                // Log error to debug console
                if (response.data && response.data.error_description) {
                    if (__DEV__) {
                        console.warn(`#onErrorCallback: ${response.data.error_description}`);
                    }
                }

                // Error server
                if (!Helpers.isNullOrEmpty(response.status)) {
                    if (__DEV__) {
                        console.warn("#onErrorCallback: Error server");
                    }
                    if (response.status === Constants.ApiCode.NOT_AUTHORIZE) {
                        // __EventEmitter.emit(Constants.EventName.TOKEN_EXPIRED);
                        // alert("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại");
                        // localStorage.clear();
                        throw Error("\"Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại\"");
                        console.log("Error token expired");
                        return;
                    }
                    if (Helpers.isFunction(request.onError)) {
                        const messages: any = "";
                        request.onError({
                            code: Constants.ApiCode.INTERNAL_SERVER,
                            message: response.data,
                        } as IError);
                    }
                    return;
                }
            }
        }
    }

    return { Put, Get, Post, Delete, PostFormData };
}

export default APIAccessor;