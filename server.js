const qrCode = require("qrcode-terminal");
const fs = require("fs");
const { Client, LocalAuth } = require("whatsapp-web.js");
const axios = require("axios");
let isBotActive = true;
const chatBotArray = [];
const greetingsArray = [];
const pujianArray = [];
const questionsArray = [];

const myActivity = "Ngoding";

const createGreatingObject = (message) =>
  greetingsArray.push({
    message,
    answer: `${message} juga!`,
  });

const createChatBotObject = (message, answer) =>
  chatBotArray.push({
    message,
    answer,
  });

const createQuestionObject = (message, answer) =>
  questionsArray.push({
    message,
    answer,
  });

const createPujianObject = (message, answer) =>
  pujianArray.push({
    message,
    answer,
  });

const chatBotCommandsTextFormat = `Ketik pesan berikut :
  
  #help: Untuk meminta bantuan.
  #ask: Untuk bertanya.
  #ngobrol: Untuk ngobrol biasa`;

const helpCommand = () => {
  isBotActive = false;
  return "Mau minta bantuan apa ?";
};

const askCommand = () => {
  isBotActive = false;
  return `Mau tanya apa ?
  1. Pacar 
  2. Programming
  3. Main / hangout
  4. Lainnya 
  Pilih dengan ketik #ask nomor, eg: #ask 1 :)`;
};

const ngobrolCommand = () => {
  isBotActive = false;
  return "Mau ngobrol apa ?";
};

const chooseAskCommad = (command) => {
  commandNumber = command.split(" ")[1];
  console.log(commandNumber);

  if (!commandNumber) return "Masukkan nomor yang benar!";

  if (commandNumber == "1") {
    return "Belum punya pacar :)";
  }

  if (commandNumber == "2") {
    isBotActive = false;
    return "Silahkan bertanya tentang dunia programming :)";
  }

  if (commandNumber == "3") {
    isBotActive = false;
    return "Dimana ?";
  }

  if (commandNumber == "4") {
    isBotActive = false;
    return "Silahkan, mau tanya apa ?";
  }
};

const initializeMessages = () => {
  createGreatingObject("selamat malam");
  createGreatingObject("selamat pagi");
  createGreatingObject("selamat sore");
  createGreatingObject("selamat siang");

  createChatBotObject("le", `iya, ada apa ? saya lagi ${myActivity}!`);
  createChatBotObject("ren", `iya, ada apa ? saya lagi ${myActivity}!`);
  createChatBotObject("rendi", `iya, ada apa ? saya lagi ${myActivity}!`);
  createChatBotObject("mas", `iya, ada apa ? saya lagi ${myActivity}!`);
  createChatBotObject("bang", `iya, ada apa ? saya lagi ${myActivity}!`);
  createChatBotObject("bro", `iya, ada apa ? saya lagi ${myActivity}!`);
  createChatBotObject("p", `iya, ada apa ? saya lagi ${myActivity}!`);
  createChatBotObject("ping", `iya, ada apa ? saya lagi ${myActivity}!`);

  createQuestionObject(
    "apa kabar ?",
    "Baik, alhamdulillah bagaimana denganmu ?"
  );

  createPujianObject("selamat", "thanks");
  createPujianObject("keren", "thanks");
  createPujianObject("bagus", "thanks");
  createPujianObject("good", "thanks");
  createPujianObject("anjay", "thanks");
};

initializeMessages();

const answerMessage = (userMessage) => {
  const cleanedMessage = userMessage.trim().toLowerCase();

  if (cleanedMessage === "!on") {
    isBotActive = true;
  }

  if (cleanedMessage.includes("#help")) {
    return helpCommand();
  }

  if (cleanedMessage.includes("#ask")) {
    return askCommand();
  }

  if (cleanedMessage.includes("#ngobrol")) {
    return ngobrolCommand();
  }

  if (!isBotActive)
    return "Bot sedang mati, ketik !on untuk mengaktifkan kembali!";

  const matchedGreting = greetingsArray.find(({ message }) => {
    const regex = new RegExp(message, "i");
    return regex.test(cleanedMessage);
  });

  const matchedPujian = pujianArray.find(({ message }) => {
    const regex = new RegExp(message, "i");
    return regex.test(cleanedMessage);
  });

  const matchedQuestion = questionsArray.find(({ message }) => {
    const regex = new RegExp(message, "i");
    return regex.test(cleanedMessage);
  });

  const matchedMessage = chatBotArray.find(({ message }) => {
    return cleanedMessage === message;
  });

  if (matchedGreting) return matchedGreting.answer;
  if (matchedQuestion) return matchedQuestion.answer;
  if (matchedPujian) return matchedPujian.answer;

  return matchedMessage ? matchedMessage.answer : chatBotCommandsTextFormat;
};

// const run = () => {
//   if (!isBotActive) return;

//   const message = "#ask";
//   console.log(message);
//   console.log(answerMessage(message));
//   console.log(chooseAskCommad(message + " 3"));
//   console.log(answerMessage("sedudo"));
// };

// run();

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one",
  }),
});

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

  const answer = answerMessage(textMessage);

  await message.reply(answer);
});
