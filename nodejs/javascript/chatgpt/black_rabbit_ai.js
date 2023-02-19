import { ChatGPTAPI } from "chatgpt";
import { createClient } from "redis";
import { log } from "wechaty";
import Config from "../config.js";

/**
 * 休眠。
 *
 * @param {Number} millis 毫秒
 */
async function sleep(millis) {
  return new Promise((resolve, _) => setTimeout(resolve, millis));
}

/**
 * 获取会话环境上下文。
 *
 * @param {String} chatId 会话 ID
 * @returns {Promise<Object>} 环境上下文
 */
async function getContext(chatId) {
  const key = Config.black_rabbit_context_key_prefix + chatId;

  let context = await redis.GET(key);
  if (!context) {
    return null;
  }

  return JSON.parse(context);
}

/**
 * 更新会话环境上下文。
 *
 * @param {String} chatId 微信会话 ID
 * @param {String} conversationId ChatGPT 会话 ID
 * @param {String} parentMessageId 父消息 ID
 */
async function updateContext(chatId, conversationId, parentMessageId) {
  const key = Config.black_rabbit_context_key_prefix + chatId;
  const context = {
    conversationId: conversationId,
    parentMessageId: parentMessageId,
  };

  await redis.SET(key, JSON.stringify(context));
}

/**
 * 推送回复消息。
 *
 * @param {String} mid 消息 ID
 * @param {String} reply 消息
 */
async function push(mid, reply) {
  const key = Config.black_rabbit_replay_key_refix + mid;

  await redis.SET(key, reply);
}

/* ChatGPT */
const api = new ChatGPTAPI({
  apiKey: Config.openai_api_key,
});

/* Redis */
const redis = createClient({
  url: Config.redis_url,
});

await redis.connect();

while (true) {
  // 获取消息
  let entity = await redis.LPOP(Config.black_rabbit_messages_key);
  if (!entity) {
    log.info("AI", "wait message...");
    await sleep(Config.black_rabbit_ai_sleep);

    continue;
  }

  entity = JSON.parse(entity);

  const mid = entity.mid;
  const chatId = entity.chatId;
  const text = entity.text;
  if (!mid || !chatId || !text) {
    continue;
  }

  log.info("AI", "mid: %s, chatId: %s, text: %s", mid, chatId, text);

  // 获取会话环境上下文
  const context = await getContext(chatId);
  log.info(
    "AI",
    "conversationId: %s, parentMessageId: %s",
    context ? context.conversationId : "",
    context ? context.parentMessageId : ""
  );

  // AI
  const response = context
    ? await api.sendMessage(text, {
        promptPrefix: Config.black_rabbit_prompt,
        conversationId: context.conversationId,
        parentMessageId: context.parentMessageId,
      })
    : await api.sendMessage(text);

  // 更新会话环境上下文
  await updateContext(chatId, response.conversationId, response.id);

  const reply = response.text;

  // 推送回复消息
  await push(mid, reply);
  log.info(
    "AI",
    "chatId: %s, mid: %s, text: %s, reply: %s",
    chatId,
    mid,
    text,
    reply
  );
}
