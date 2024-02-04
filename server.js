const qrCode = require("qrcode-terminal");
const fs = require("fs");
const { Client, LocalAuth } = require("whatsapp-web.js");
const axios = require("axios");
const puppeteer = require("puppeteer");
const apiKey = "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";

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one",
  }),
});

const run = async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto("http://chat-bot.ap-1.evennode.com/");

  const three = await page.evaluate(() => {
    return 1 + 2;
  });

  console.log(three);

  await browser.close();
};

run();

client.on("authenticated", async (session) => {
  console.log("Authenticated with session:", session);
});

client.initialize();

client.on("qr", (qr) => {
  qrCode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready to receive messages.");
});

client.on("message", async (message) => {
  const textMessage = message.body.toLowerCase();

  const greetings = ["ren", "p", "bang", "bro", "le"];
  if (greetings.includes(textMessage)) {
    await message.reply("Iya ada apa ?");
    return;
  }

  if (textMessage.includes("berapa hari dalam seminggu?")) {
    await message.reply("Dalam seminggu ada 7 hari.");
    return;
  }

  if (textMessage.includes("selamat pagi")) {
    await message.reply("Selamat pagi juga!");
    return;
  }

  if (textMessage.includes("selamat siang")) {
    await message.reply("Selamat siang juga!");
    return;
  }

  if (textMessage.includes("selamat malam")) {
    await message.reply("Selamat malam juga!");
    return;
  }

  if (textMessage.includes("apa kabar?")) {
    await message.reply("Alhamdulillah, baik. Bagaimana dengan Anda?");
    return;
  }

  await message.reply(
    "Maaf, saya tidak mengerti pertanyaan Anda. Silakan ajukan pertanyaan lainnya."
  );
});
