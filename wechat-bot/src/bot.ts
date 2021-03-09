import {
  Contact,
  Message,
  ScanStatus,
  Wechaty,
  log,
  Room,
  PuppetModuleName,
} from "wechaty";
import { PuppetPadlocal } from "wechaty-puppet-padlocal";
import { generate } from "qrcode-terminal";
require("dotenv").config();
const fetch = require("node-fetch");

const BotName = "软微扩展版Bot";
const helpInfo = `
====Powered by Wechaty ====
    欢迎使用软微扩展版bot
1. /help 展示帮助
2. /close 结束群聊
___________________________
`;

const carpoolStartedInfo = `
预定时间已到，祝一路顺风平安。本群聊讲在10天后自动解散。
`;

const apiUrl = "http://localhost:8080";

class Bot {
  public bot: Wechaty;
  public botName: string;
  private helper1: Contact | null;
  private helper2: Contact | null;

  constructor() {
    this.botName = BotName;
    this.bot = new Wechaty({
      name: this.botName,
      puppet: new PuppetPadlocal({}),
    });
    this.helper1 = null;
    this.helper2 = null;
  }

  private onScan(qrcode: string, status: ScanStatus) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      generate(qrcode, { small: true }); // show qrcode on console
      const qrcodeImageUrl = [
        "https://wechaty.js.org/qrcode/",
        encodeURIComponent(qrcode),
      ].join("");

      log.info(
        this.botName,
        "onScan: %s(%s) - %s",
        ScanStatus[status],
        status,
        qrcodeImageUrl
      );
    } else {
      log.info(this.botName, "onScan: %s(%s)", ScanStatus[status], status);
    }
  }

  private onLogin(user: Contact) {
    log.info(this.botName, "%s login", user);
  }

  private onLogout(user: Contact) {
    log.info(this.botName, "%s logout", user);
  }

  public async Logout() {
    await this.bot.logout();
  }

  private async onMessage(msg: Message) {
    log.info(this.botName, msg.toString());

    // 获得群聊实例
    const room = msg.room();

    // 如果不是群聊信息，暂时不处理
    if (room == null) {
      return;
    }

    // 如果不是@Bot的信息，暂时不处理
    if ((await msg.mentionSelf()) == false) {
      return;
    }

    const info = msg.text();

    // 如果不是"/"开头的命令，返回错误信息
    if (!info.startsWith("/")) {
      //await msg.say("我听不懂你在说什么哟🙉");
      //await msg.say(helpInfo);
      return;
    }

    switch (info) {
      case "/help":
        await msg.say(helpInfo);
        break;
      case "/hide":
        break;
      case "/show":
        break;
    }
  }

  public async Test(roomId: string) {
    const room = await this.GetRoomByRoomId(roomId);
    const mems = await room.memberAll();
    var currentMember = mems.length - 1;
    log.info("currentMember=", currentMember);
    currentMember = 4;
    const url = apiUrl + "/carpool/update";
    log.info("url=", url);
    const content = JSON.stringify({
      wechat_room_id: room.id,
      current_member: currentMember,
    });
    await fetch(url, {
      method: "POST",
      body: content,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        log.info("[onRoomJoin] get response, ", json);
      })
      .catch((err) => console.log(err));
  }

  private async updateRoomMember(room: Room, currentMember: number) {
    const url = apiUrl + "/carpool/update";
    const content = JSON.stringify({
      wechat_room_id: room.id,
      current_member: currentMember,
    });
    log.info("[updateRoomMember] url=", url);
    log.info("[updateRoomMember] content=", content);

    await fetch(url, {
      method: "POST",
      body: content,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        log.info("[updateRoomMember] get response, ", JSON.stringify(json));
      })
      .catch((err) => console.log(err));
  }

  private async onRoomJoin(room, inviteeList, inviter) {
    log.info(
      'EVENT: room-join - Room "%s" got new member "%s", invited by "%s"',
      room.id,
      inviteeList.map((c) => c.name()).join(","),
      inviter.name()
    );
    const mems = await room.memberAll();
    const currentMember: number = mems.length - 1;
    log.info(
      '[onRoomJoin] roomId="%s", currentMember="%s"',
      room.id,
      currentMember
    );
    await this.updateRoomMember(room, currentMember);
  }

  private async onRoomLeave(room, leaverList) {
    log.info(
      'EVENT: room-leave - Room "%s" lost member "%s"',
      room.id,
      leaverList.map((c) => c.name()).join(",")
    );
    const mems = await room.memberAll();
    const currentMember: number = mems.length - 1;
    log.info(
      '[onRoomLeave] roomId="%s", currentMember="%s"',
      room.id,
      currentMember
    );
    await this.updateRoomMember(room, currentMember);
  }

  public start() {
    this.bot.on("scan", this.onScan);
    this.bot.on("login", this.onLogin);
    this.bot.on("logout", this.onLogout);
    this.bot.on("message", this.onMessage);
    this.bot.on("room-join", this.onRoomJoin);
    this.bot.on("room-leave", this.onRoomLeave);
    this.bot
      .start()
      .then(() => log.info(this.botName, "Bot Started."))
      .catch((e) => log.error(this.botName, e));
  }

  public async CloseRoomByRoomId(roomId: string) {
    const room = await this.GetRoomByRoomId(roomId);
    // 删除所有用户
    const memberList: Contact[] = await room.memberAll();
    for (const memeber of memberList) {
      if (memeber.self()) continue;
      try {
        await room.del(memeber);
      } catch (e) {
        console.error(e);
        throw new Error(
          `[CloseRoomByRoomId] delete user failed, contactId=${memeber.id}, roomId=${roomId}`
        );
      }
    }
    // Bot退出群聊
    await room.quit();
  }

  public async GetIdByName(nickName: string) {
    const contact = await this.bot.Contact.find({ name: nickName });
    if (contact == null) {
      throw new Error(`cant find user by name, name=${name}`);
    }
    console.log(contact.id);
  }

  public async GetRoomByRoomId(roomId: string): Promise<Room> {
    const room = await this.bot.Room.find({ id: roomId });
    if (room == null) {
      throw new Error(`[GetRoomByRoomId] get room error, roomId=${roomId}`);
    }
    return room;
  }

  public async GetQRCodeByRoomId(roomId: string): Promise<string> {
    const room = await this.GetRoomByRoomId(roomId);
    if (room == null) {
      log.error(
        "[GetQRCodeByRoomId] can not find room by roomId, roomId=%v",
        roomId
      );
      return "";
    }
    const qrcode = await room.qrCode();
    log.info(
      "Bot GetQRCodeByRoomId success, roomId=%s, qrcode=%s",
      roomId,
      qrcode
    );
    return qrcode;
  }

  public async CreateEmptyRoom(newtopic: string): Promise<Room> {
    if (this.helper1 == null) {
      const helperId1 = "wxid_pwqoi2qzmf3e12";
      this.helper1 = await this.bot.Contact.find({ id: helperId1 });
      if (this.helper1 == null) {
        throw new Error("[CreateEmptyRoom] detect helper1 is null");
      }
    }
    if (this.helper2 == null) {
      const helperId2 = "wxid_684i6s0mhpq222";
      this.helper2 = await this.bot.Contact.find({ id: helperId2 });
      if (this.helper2 == null) {
        throw new Error("[CreateEmptyRoom] detect helper2 is null");
      }
    }

    // create room from two helper
    const contactList = [this.helper1, this.helper2];
    const room = await this.bot.Room.create(contactList, newtopic);
    if (room == null) {
      log.error("[CreateEmptyRoom] bot create room failed");
      throw new Error(`[CreateEmptyRoom] create new room failed`);
    }

    // delete helper from room
    const memberList: Contact[] = await room.memberAll();
    for (const memeber of memberList) {
      await delay(300);
      if (memeber.self()) continue;
      try {
        await room.del(memeber);
      } catch (e) {
        console.error(e);
        throw new Error(
          `[CreateEmptyRoom] delete user failed, contactId=${memeber.id}, roomId=${room.id}`
        );
      }
    }
    await room.say("success");

    log.info("[CreateEmptyRoom] create new room succees, roomId=", room.id);

    return room;
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default Bot;
