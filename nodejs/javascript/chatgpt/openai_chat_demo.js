import { Configuration, OpenAIApi } from "openai";
import Config from "../config.js";

const configuration = new Configuration({
  apiKey: Config.openai_api_key,
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "你是一个智能助手。",
    },
    {
      role: "user",
      content: "你的名字？",
    },
    {
      role: "assistant",
      content: "黑兔子。",
    },
    {
      role: "user",
      content: "介绍一下你自己",
    },
  ],
});

console.log(completion.data.choices[0].message);
