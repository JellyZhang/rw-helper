import { Contact, Message, ScanStatus, Wechaty, log } from "wechaty";
import { generate } from "qrcode-terminal";
import { readFileSync } from "fs";
import Bot from "./bot";
import express from "express";
import bodyParser from "body-parser";
import { ERROR_CODE, ERROR_MSG, Resp } from "./consts";

const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: true }));

const bot = new Bot();
bot.start();

// get userId by username
app.get("/id/byname", async (req, res) => {
  let name: string = req.query.name as string;
  try {
    await bot.GetIdByName(name);
    res.send(new Resp(ERROR_CODE.Success, ERROR_MSG.Success, null));
  } catch (e) {
    console.log("Error", e);
    res.send(new Resp(ERROR_CODE.SystemError, ERROR_MSG.SystemError, null));
  }
});

// get a new empty room
app.get("/room/create", async (req, res) => {
  try {
    let topic: string = req.query.topic as string;
    log.info("start create room, topic=", topic);
    const room = await bot.CreateEmptyRoom(topic);
    const qrcode = await room.qrCode();
    res.send(
      new Resp(ERROR_CODE.Success, ERROR_MSG.Success, {
        roomId: room.id,
        qrcode: qrcode,
      })
    );
  } catch (e) {
    console.log("Error", e);
    res.send(new Resp(ERROR_CODE.SystemError, ERROR_MSG.SystemError, null));
  }
});

// logout
app.post("/logout", async (req, res) => {
  try {
    await bot.Logout();
    res.send(new Resp(ERROR_CODE.Success, ERROR_MSG.Success, null));
  } catch (e) {
    console.log("Error", e);
    res.send(new Resp(ERROR_CODE.SystemError, ERROR_MSG.SystemError, null));
  }
});

// ping
app.get("/ping", async (req, res) => {
  res.send(new Resp(ERROR_CODE.Success, ERROR_MSG.Success, null));
});

app.listen(3000, () => {
  console.log("bot is listening on port 3000!");
});
