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

// send message by username
app.post("/msg/name", async (req, res) => {
  let name: string = req.query.name as string;
  let msg: string = req.query.msg as string;
  try {
    await bot.SendMsgByName(name, msg);
  } catch (e) {
    console.log("Error", e);
  }
  res.send(new Resp(ERROR_CODE.Success, ERROR_MSG.Success, null));
});

// send message by userId
app.post("/msg/id", async (req, res) => {
  let id: string = req.query.id as string;
  let msg: string = req.query.msg as string;
  try {
    await bot.SendMsgById(id, msg);
  } catch (e) {
    console.log("Error", e);
  }
  res.send(new Resp(ERROR_CODE.Success, ERROR_MSG.Success, null));
});

// get userId by username
app.get("/id/byname", async (req, res) => {
  let name: string = req.query.name as string;
  try {
    await bot.GetIdByName(name);
  } catch (e) {
    console.log("Error", e);
  }
  res.send(new Resp(ERROR_CODE.Success, ERROR_MSG.Success, null));
});

// create room by userId
app.post("/room/create", async (req, res) => {
  let id: string = req.query.id as string;
  let topic: string = req.query.topic as string;
  let resp: any = {};
  try {
    const room = await bot.CreateRoomById(id, topic);
    resp.id = room.id;
  } catch (e) {
    console.log("Error", e);
  }
  res.send(new Resp(ERROR_CODE.Success, ERROR_MSG.Success, resp));
});

// invite someone to a room
app.post("/room/invite", async (req, res) => {
  let userId: string = req.query.userId as string;
  let roomId: string = req.query.roomId as string;
  try {
    const room = await bot.InviteToRoom(userId, roomId);
  } catch (e) {
    console.log("Error", e);
  }
  res.send(new Resp(ERROR_CODE.Success, ERROR_MSG.Success, null));
});

// logout
app.post("/logout", async (req, res) => {
  try {
    await bot.Logout();
  } catch (e) {
    console.log("Error", e);
  }
  res.send(new Resp(ERROR_CODE.Success, ERROR_MSG.Success, null));
});

// ping
app.get("/ping", async (req, res) => {
  res.send(new Resp(ERROR_CODE.Success, ERROR_MSG.Success, null));
});

app.listen(3000, () => {
  console.log("bot is listening on port 3000!");
  console.log(app._router.stack);
});
