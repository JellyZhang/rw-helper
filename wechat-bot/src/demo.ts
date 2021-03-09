import { PuppetPadlocal } from "wechaty-puppet-padlocal";
import { Contact, Message, ScanStatus, Wechaty, log } from "wechaty";
import { generate } from "qrcode-terminal";

require("dotenv").config();
const puppet = new PuppetPadlocal({});

const bot = new Wechaty({
  name: "TestBot",
  puppet,
});

bot
  .on("scan", (qrcode: string, status: ScanStatus) => {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      generate(qrcode, { small: true }); // show qrcode on console

      const qrcodeImageUrl = [
        "https://wechaty.js.org/qrcode/",
        //"https://api.qrserver.com/v1/create-qr-code/?data=",
        encodeURIComponent(qrcode),
      ].join("");

      log.info(
        "StarterBot",
        "onScan: %s(%s) - %s",
        ScanStatus[status],
        status,
        qrcodeImageUrl
      );
    } else {
      log.info("StarterBot", "onScan: %s(%s)", ScanStatus[status], status);
    }
  })

  .on("login", (user: Contact) => {
    console.log(`${user} login`);
  })

  .on("logout", (user: Contact) => {
    console.log(`${user} logout`);
  })

  .on("message", async (message: Message) => {
    console.log(`on message: ${message.toString()}`);
    if (message.text() === "ding") {
      await message.say("dong");
    }
    if (message.text() === "esc") {
      await bot.logout();
    }
    if (message.text() === "1") {
      const room = await bot.Room.find({
        topic: "阳光少年团字节分部（微信分部）",
      });
      if (room == null) {
        await message.say("no found");
      } else {
        const topic = await room.topic();
        const qr = await room.qrCode();
        await message.say(topic);
        await message.say(qr);
      }
    }
  })

  .start();

console.log("TestBot", "started");
