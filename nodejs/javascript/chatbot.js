import { WechatyBuilder, ScanStatus, log } from "wechaty";
import qrcodeTerminal from "qrcode-terminal";
import Config from "./config.js";

function onScan(qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    qrcodeTerminal.generate(qrcode, { small: true }); // show qrcode on console

    const qrcodeImageUrl = [
      "https://wechaty.js.org/qrcode/",
      encodeURIComponent(qrcode),
    ].join("");

    log.info(
      "ChatBot",
      "onScan: %s(%s) - %s",
      ScanStatus[status],
      status,
      qrcodeImageUrl
    );
  } else {
    log.info("ChatBot", "onScan: %s(%s)", ScanStatus[status], status);
  }
}

function onLogin(user) {
  log.info("ChatBot", "%s login", user);
}

function onLogout(user) {
  log.info("ChatBot", "%s logout", user);
}

async function onMessage(msg) {
  const self = msg.self();
  if (self) {
    // 自己发送的消息，不处理
    return;
  }

  // 消息群聊
  const room = msg.room();
  // 消息发送者
  const talker = msg.talker();
  // 消息类型
  const type = msg.type();
  // 消息文本
  let text = msg.text().trim();
  if (!text) {
    // 消息文本为空，不处理
    return;
  }

  log.info(
    "ChatBot",
    "message from room: %s, user: %s, type: %s, text: %s",
    room ? await room.topic() : "{}",
    talker ? talker.name() : "{}",
    type,
    text
  );

  if (text.includes(Config.chatbot_reference_separator)) {
    // 引用
    text = text.split(Config.chatbot_reference_separator)[1].trim();
  }

  if (text.startsWith(Config.chatbot_self_name)) {
    // @
    text = text.substring(Config.chatbot_self_name.length).trim();
  }

  await msg.say("[" + text + "]");
}

function onError(error) {
  log.info("ChatBot", "run error: %s", error);
}

process.env.WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT = true;

const bot = WechatyBuilder.build({
  name: "ChatBot",
  puppet: "wechaty-puppet-service",
  puppetOptions: {
    token: Config.chatbot_puppet_workpro_token,
  },
});

bot.on("scan", onScan);
bot.on("login", onLogin);
bot.on("logout", onLogout);
bot.on("message", onMessage);
bot.on("error", onError);

bot
  .start()
  .then(() => log.info("ChatBot", "started."))
  .catch((e) => log.error("ChatBot", "start error: %s", e));
