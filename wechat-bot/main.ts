import { Contact, Message, ScanStatus, Wechaty, log } from "wechaty";
import { generate } from "qrcode-terminal";
import { readFileSync } from "fs";

require("dotenv").config();

const BotName = "rw-helper-bot";

function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    generate(qrcode, { small: true }); // show qrcode on console

    const qrcodeImageUrl = [
      "https://wechaty.js.org/qrcode/",
      encodeURIComponent(qrcode),
    ].join("");

    log.info(
      BotName,
      "onScan: %s(%s) - %s",
      ScanStatus[status],
      status,
      qrcodeImageUrl
    );
  } else {
    log.info(BotName, "onScan: %s(%s)", ScanStatus[status], status);
  }
}

function onLogin(user: Contact) {
  log.info(BotName, "%s login", user);
}

function onLogout(user: Contact) {
  log.info(BotName, "%s logout", user);
}

async function onMessage(msg: Message) {
  log.info(BotName, msg.toString());

  if (msg.text() === "ding") {
    await msg.say("dong");
  }
  if (msg.text() === "esc") {
    await bot.logout();
  }

  if (msg.text() === "getall") {
    const contactList = await bot.Contact.findAll();
    log.info(String(contactList.length));
    for (const c of contactList) {
      await msg.say(c.name());
    }
  }

  if (msg.text().startsWith("get")) {
    var ss = msg.text().split(" ");
    console.log(ss);
    const c = await bot.Contact.find({ name: ss[1] });
    const p = c?.name() ?? "null";
    msg.say(p);
  }
}
console.log("??");

const token = readFileSync("./token", "utf-8");
const bot = new Wechaty({
  name: "ding-dong-bot",
  puppet: "wechaty-puppet-hostie",
  puppetOptions: {
    token,
  },
});

bot.on("scan", onScan);
bot.on("login", onLogin);
bot.on("logout", onLogout);
bot.on("message", onMessage);

bot
  .start()
  .then(() => log.info(BotName, "Bot Started."))
  .catch((e) => log.error(BotName, e));
