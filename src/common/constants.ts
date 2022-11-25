const Constants = {
    Api: {
        /** Timeout for each request: 25sec */
        TIMEOUT: 25 * 1000,
    },
    /**
     * Return code from Api
     */
    ApiCode: {
        // Code from server api
        SUCCESS: 200,
        NOT_AUTHORIZE: 401,
        // Code from local app
        CONNECTION_TIMEOUT: "CONNECTION_TIMEOUT",
        INTERNAL_SERVER: "INTERNAL_SERVER",
        UNKNOWN_NETWORK: "UNKNOWN_NETWORK",
    },
    RegExp: {
        VIETNAMESE_TEXT_NO_SPACE: /^[-a-zA-Z-0-9_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+\'?(\s+[-a-zA-Z-0-9_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\']+)*$/,
        TEXT_WITHOUT_WHITESPACE_START_OR_END: /^[^\s].+[^\s]$/,
    },
    Styles: {
        // // =====================================================================
        // // Common color
        // // =====================================================================
        // PRIMARY_COLOR: "#e44e40",
        // BLACK_COLOR: "#000000",
        // BLUE_COLOR: "#0000FF",
        // GRAY_COLOR: "#808080",
        // GREEN_COLOR: "#008000",
        // LIGHTGRAY_COLOR: "#D3D3D3",
        // RED_COLOR: "#FF0000",
        // WHITE_COLOR: "#FFFFFF",
        //
        // // New - Analysis - Processing - Processed - Cancelled - Close
        // STATUS_COLOR: ["#27AE60", "#FEC600", "#24EBC7", "#00AFF0", "#D3D3D3", "#CED4DA"],

        // =====================================================================
        // Console log style
        // Color refer at: https://www.w3schools.com/w3css/w3css_colors.asp
        // =====================================================================
        CONSOLE_LOG_DONE_ERROR: "border: 2px solid #F44336; color: #000000", // Red
        CONSOLE_LOG_DONE_SUCCESS: "border: 2px solid #4CAF50; color: #000000", // Green
        CONSOLE_LOG_ERROR: "background: #F44336; color: #FFFFFF", // Red
        CONSOLE_LOG_NOTICE: "background: #FF9800; color: #000000; font-size: x-large", // Orange
        CONSOLE_LOG_PREPARE: "border: 2px solid #2196F3; color: #000000", // Blue
        CONSOLE_LOG_START: "background: #2196F3; color: #FFFFFF", // Blue
        CONSOLE_LOG_SUCCESS: "background: #4CAF50; color: #FFFFFF", // Green

        // // =====================================================================
        // // Common size
        // // =====================================================================
        // AVATAR_SIZE: "80px",
        // DEFAULT_FONTSIZE: "16px",
        // DEFAULT_SPACING: "24px",
    },
};

export default Constants;