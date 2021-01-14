"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("./bot"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const consts_1 = require("./consts");
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: true }));
const bot = new bot_1.default();
bot.start();
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Got body:", req.body);
    let name = req.query.name;
    let msg = req.query.msg;
    try {
        yield bot.sendMsgByName(name, msg);
    }
    catch (e) {
        console.log("Error", e);
    }
    res.send(new consts_1.Resp(consts_1.ERROR_CODE.Success, consts_1.ERROR_MSG.Success));
}));
app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});
