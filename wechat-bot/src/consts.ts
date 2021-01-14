// error code
export enum ERROR_CODE {
  Success = 0,
  ParamsError = 1,
  SystemError = 99,
}

// error msg
export enum ERROR_MSG {
  Success = "success",
  ParamsError = "parameters error",
  SystemError = "system error",
}

// struct for return json
export class Resp {
  public errCode: number;
  public errMsg: string;
  public data: any;
  constructor(errCode: number, errMsg: string, data: any) {
    this.errCode = errCode;
    this.errMsg = errMsg;
    this.data = data;
  }
}
