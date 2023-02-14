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
  log.info("ChatBot", msg.toString());

  if (msg.text() === "ding") {
    await msg.say("dong");
  }
}

function onError(error) {
  log.info("ChatBot", "run error: %s", error);
}

process.env.WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT = true;

const bot = WechatyBuilder.build({
  name: "ding-dong-bot",
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
