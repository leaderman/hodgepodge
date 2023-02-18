import { ChatGPTAPI } from "chatgpt";
import Config from "../config.js";

async function example() {
  const api = new ChatGPTAPI({
    apiKey: Config.openai_api_key,
  });

  const res = await api.sendMessage("Hello World!");
  console.log("conversationId:", res.conversationId);
  console.log("messageId:", res.id);
  console.log("text:", res.text);
}

example();
