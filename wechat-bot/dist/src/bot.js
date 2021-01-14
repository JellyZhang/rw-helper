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
Object.defineProperty(exports, "__esModule", { value: true });
const wechaty_1 = require("wechaty");
const qrcode_terminal_1 = require("qrcode-terminal");
const fs_1 = require("fs");
const BotName = "rw-helper-bot";
const TokenFilePath = "config/token";
const PuppetFilePath = "config/puppet";
//const TokenFilePath = "./token";
//const PuppetFilePath = "./puppet";
class Bot {
    constructor() {
        this.botName = BotName;
        this.token = fs_1.readFileSync(TokenFilePath, "utf-8").replace(/\s/g, "");
        this.puppetString = fs_1.readFileSync(PuppetFilePath, "utf-8").replace(/\s/g, "");
        this.puppet = this.puppetString;
        this.bot = new wechaty_1.Wechaty({
            name: this.botName,
            puppet: this.puppet,
            puppetOptions: {
                token: this.token,
            },
        });
    }
    onScan(qrcode, status) {
        if (status === wechaty_1.ScanStatus.Waiting || status === wechaty_1.ScanStatus.Timeout) {
            qrcode_terminal_1.generate(qrcode, { small: true }); // show qrcode on console
            const qrcodeImageUrl = [
                "https://wechaty.js.org/qrcode/",
                encodeURIComponent(qrcode),
            ].join("");
            wechaty_1.log.info(this.botName, "onScan: %s(%s) - %s", wechaty_1.ScanStatus[status], status, qrcodeImageUrl);
        }
        else {
            wechaty_1.log.info(this.botName, "onScan: %s(%s)", wechaty_1.ScanStatus[status], status);
        }
    }
    onLogin(user) {
        wechaty_1.log.info(this.botName, "%s login", user);
    }
    onLogout(user) {
        wechaty_1.log.info(this.botName, "%s logout", user);
    }
    onMessage(msg) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            wechaty_1.log.info(this.botName, msg.toString());
            if (msg.text() === "ding") {
                yield msg.say("dong");
            }
            if (msg.text() === "esc") {
                yield this.bot.logout();
            }
            if (msg.text() === "getall") {
                const contactList = yield this.bot.Contact.findAll();
                wechaty_1.log.info(String(contactList.length));
                for (const c of contactList) {
                    yield msg.say(c.name());
                }
            }
            if (msg.text().startsWith("get")) {
                var ss = msg.text().split(" ");
                console.log(ss);
                let c = yield this.bot.Contact.find({ id: ss[1] });
                let p = (_a = c === null || c === void 0 ? void 0 : c.name()) !== null && _a !== void 0 ? _a : "null";
                msg.say(p);
            }
        });
    }
    start() {
        this.bot.on("scan", this.onScan);
        this.bot.on("login", this.onLogin);
        this.bot.on("logout", this.onLogout);
        this.bot.on("message", this.onMessage);
        this.bot
            .start()
            .then(() => wechaty_1.log.info(this.botName, "Bot Started."))
            .catch((e) => wechaty_1.log.error(this.botName, e));
    }
    sendMsgByName(nickName, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield this.bot.Contact.find({ name: nickName });
            if (c == null) {
                throw new Error(`cant find user by name, name=${nickName}`);
            }
            yield c.say(msg);
        });
    }
    sendMsgById(id, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield this.bot.Contact.find({ id: id });
            if (c == null) {
                throw new Error(`cant find user by id, id=${id}`);
            }
            yield c.say(msg);
        });
    }
}
exports.default = Bot;
