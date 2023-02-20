import { WechatyBuilder, ScanStatus, log } from "wechaty";
import qrcodeTerminal from "qrcode-terminal";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "redis";
import axios from "axios";

import Config from "../config.js";

function onScan(qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    qrcodeTerminal.generate(qrcode, { small: true }); // show qrcode on console

    const qrcodeImageUrl = [
      "https://wechaty.js.org/qrcode/",
      encodeURIComponent(qrcode),
    ].join("");

    log.info(
      "BlackRabbit",
      "onScan: %s(%s) - %s",
      ScanStatus[status],
      status,
      qrcodeImageUrl
    );
  } else {
    log.info("BlackRabbit", "onScan: %s(%s)", ScanStatus[status], status);
  }
}

function onLogin(user) {
  log.info("BlackRabbit", "%s login", user);
}

function onLogout(user) {
  log.info("BlackRabbit", "%s logout", user);
}

async function onMessage(msg) {
  const self = msg.self();
  if (self) {
    // 自己发送的消息，不处理
    return;
  }

  // 消息类型
  const type = msg.type();
  if (type !== 7) {
    // 不是文本消息，不处理
    return;
  }

  // 消息文本
  let text = msg.text().trim();
  if (!text) {
    // 消息为空，不处理
    return;
  }

  // 群聊
  const room = msg.room();
  // 群聊 ID
  const roomId = room ? room.id : null;
  // 群聊名称
  const roomName = room ? await room.topic() : null;

  // 用户
  const user = msg.talker();
  // 用户 ID
  const userId = user ? user.id : null;
  // 用户名称
  const userName = user ? user.name() : null;

  if (text.includes(Config.chatbot_reference_separator)) {
    // 从引用消息中截取消息
    text = text.split(Config.chatbot_reference_separator)[1].trim();
  }

  if (room) {
    // 群聊消息
    if (!text.startsWith(Config.chatbot_self_name)) {
      // 不是 @ 自己的消息，不处理
      return;
    }

    // 从 @ 消息中截取消息
    text = text.substring(Config.chatbot_self_name.length).trim();
  }

  let mid = uuidv4();
  let reply = "";

  if (text) {
    if (text === Config.black_rabbit_activity) {
      /* 
        查询活动 
      */
      reply = await getActivityNames();
      console.log(reply);
    } else {
      /*
        对话
      */

      // 推送消息
      await push(mid, room ? roomId : userId, text);
      // 拉取回复消息
      reply = await pull(mid);
    }
  } else {
    reply = Config.black_rabbit_greeting;
  }

  if (!reply) {
    reply = Config.balck_rabbit_busy;
  }

  await msg.say(reply);

  // 打印 ChatGPT 消息
  log.info(
    "BlackRabbit",
    "ChatGPT mid: %s, room: %s, user: %s, type: %s, text: %s, replay: %s",
    mid,
    room ? "[" + roomId + ", " + roomName + "]" : "[]",
    user ? "[" + userId + ", " + userName + "]" : "[]",
    type,
    text,
    reply
  );
}

/**
 * 获取活动名称列表。
 *
 * @returns {Promise<String>} 活动名称列表（多行字符串）
 */
async function getActivityNames() {
  const response = await axios.get(
    Config.meetu_api_address + Config.meetu_api_activity_get_recoms,
    {
      headers: {
        token: Config.meetu_api_token,
      },
      params: {
        page: 1,
        pageSize: Config.meetu_api_activity_get_recoms_max,
      },
    }
  );

  const activities = response.data.data;
  if (!activities || !activities.length) {
    return "";
  }

  return activities.map((activity) => activity.name).join("\n");
}

/**
 * 推送消息。
 *
 * @param {String} mid 消息 ID
 * @param {String} chatId 会话 ID
 * @param {String} message 消息文本
 * @returns {Promise<String>} 消息 ID
 */
async function push(mid, chatId, text) {
  const entity = {
    mid: mid,
    chatId: chatId,
    text: text,
  };

  await redis.RPUSH(Config.black_rabbit_messages_key, JSON.stringify(entity));

  return mid;
}

/**
 * 拉取回复消息。
 *
 * @param {String} mid 消息 ID
 * @returns {Promise<String>} 消息
 */
async function pull(mid) {
  return new Promise((resolve, _) => {
    let tries = 0;

    const intervalId = setInterval(async () => {
      if (++tries > Config.black_rabbit_wechat_tries) {
        clearInterval(intervalId);

        resolve(null);
      }

      const key = Config.black_rabbit_replay_key_refix + mid;

      const replay = await redis.GET(key);
      if (replay) {
        clearInterval(intervalId);

        resolve(replay);
      }
    }, Config.black_rabbit_wechat_sleep);
  });
}

function onError(error) {
  log.info("BlackRabbit", "run error: %s", error);
}

process.env.WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT = true;

/* Wechaty */
const bot = WechatyBuilder.build({
  name: "BlackRabbit",
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

await bot.start();
log.info("BlackRabbit", "started");

/* Redis */
const redis = createClient({
  url: Config.redis_url,
});

await redis.connect();
