"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resp = exports.ERROR_MSG = exports.ERROR_CODE = void 0;
// error code
var ERROR_CODE;
(function (ERROR_CODE) {
    ERROR_CODE[ERROR_CODE["Success"] = 0] = "Success";
    ERROR_CODE[ERROR_CODE["ParamsError"] = 1] = "ParamsError";
    ERROR_CODE[ERROR_CODE["SystemError"] = 99] = "SystemError";
})(ERROR_CODE = exports.ERROR_CODE || (exports.ERROR_CODE = {}));
// error msg
var ERROR_MSG;
(function (ERROR_MSG) {
    ERROR_MSG["Success"] = "success";
    ERROR_MSG["ParamsError"] = "parameters error";
    ERROR_MSG["SystemError"] = "system error";
})(ERROR_MSG = exports.ERROR_MSG || (exports.ERROR_MSG = {}));
// struct for return json
class Resp {
    constructor(errCode, errMsg) {
        this.errCode = errCode;
        this.errMsg = errMsg;
    }
}
exports.Resp = Resp;
