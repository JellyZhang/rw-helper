import {
  Contact,
  Message,
  ScanStatus,
  Wechaty,
  log,
  Room,
  PuppetModuleName,
} from "wechaty";
import { generate } from "qrcode-terminal";
import { readFileSync } from "fs";

const BotName = "rw-helper-bot";
const TokenFilePath = "config/token";
const PuppetFilePath = "config/puppet";

class Bot {
  public bot: Wechaty;
  public botName: string;
  private token: string;
  private puppetString: string;
  private puppet: PuppetModuleName;

  constructor() {
    this.botName = BotName;
    this.token = readFileSync(TokenFilePath, "utf-8").replace(/\s/g, "");
    this.puppetString = readFileSync(PuppetFilePath, "utf-8").replace(
      /\s/g,
      ""
    );
    this.puppet = this.puppetString as PuppetModuleName;
    this.bot = new Wechaty({
      name: this.botName,
      puppet: this.puppet,
      puppetOptions: {
        token: this.token,
      },
    });
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

    if (msg.text() === "ding") {
      await msg.say("dong");
    }
    if (msg.text() === "getall") {
      const contactList = await this.bot.Contact.findAll();
      log.info(String(contactList.length));
      for (const contact of contactList) {
        await msg.say(contact.name());
      }
    }

    if (msg.text().startsWith("get")) {
      var ss = msg.text().split(" ");
      console.log(ss);
      let c = await this.bot.Contact.find({ id: ss[1] });
      let p = c?.name() ?? "null";
      msg.say(p);
    }
  }

  public start() {
    this.bot.on("scan", this.onScan);
    this.bot.on("login", this.onLogin);
    this.bot.on("logout", this.onLogout);
    this.bot.on("message", this.onMessage);
    this.bot
      .start()
      .then(() => log.info(this.botName, "Bot Started."))
      .catch((e) => log.error(this.botName, e));
  }

  public async SendMsgByName(nickName: string, msg: string) {
    const contact = await this.bot.Contact.find({ name: nickName });
    if (contact == null) {
      throw new Error(`cant find user by name, name=${nickName}`);
    }
    await contact.say(msg);
  }

  public async SendMsgById(id: string, msg: string) {
    const contact = await this.bot.Contact.find({ id: id });
    if (contact == null) {
      throw new Error(`cant find user by id, id=${id}`);
    }
    await contact.say(msg);
  }

  public async GetIdByName(nickName: string) {
    const contact = await this.bot.Contact.find({ name: nickName });
    if (contact == null) {
      throw new Error(`cant find user by name, name=${name}`);
    }
    console.log(contact.id);
  }

  public async CreateRoomById(id: string, topic: string): Promise<Room> {
    const contact = await this.bot.Contact.find({ id: id });
    if (contact == null) {
      throw new Error(`cant find user by id, id=${id}`);
    }
    id = "7881303488932098";
    const helper = await this.bot.Contact.find({ id: id });
    if (helper == null) {
      throw new Error(`cant find user by id, id=${id}`);
    }
    const contactList = [contact, helper];
    const room = await this.bot.Room.create(contactList, topic);
    console.log("createDingRoom() new ding room created: ", room);
    return room;
  }

  public async InviteToRoom(userId: string, roomId: string) {
    const contact = await this.bot.Contact.find({ id: userId });
    if (contact == null) {
      throw new Error(`cant find user by id, id=${userId}`);
    }
    const room = await this.bot.Room.find({ id: roomId });
    if (room == null) {
      throw new Error(`cant find room by id, id=${roomId}`);
    }
    try {
      await room.add(contact);
    } catch (e) {
      console.error(e);
    }
  }
}

export default Bot;
