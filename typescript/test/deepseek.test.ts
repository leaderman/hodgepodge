import { DeepSeek } from "../src/deepseek";
import { ChatCompletionRequest } from "../src/deepseek";

describe("DeepSeek", () => {
  it("should be defined", async () => {
    const deepSeek = new DeepSeek("sk-67ad1412c9274933839bcc3bc5f7b01f");

    const result = await deepSeek.chat.completions.create({
      messages: [
        {
          content: "你是一个微信小程序技术专家",
          role: "system",
        },
        {
          content: "你好",
          role: "user",
        },
      ],
      model: "deepseek-chat",
    });

    console.log("messages:", result.choices[0].message.content);
    console.log("total_tokens:", result.usage.total_tokens);
    console.log("result:", JSON.stringify(result));

    console.log(
      "logprobs:",
      JSON.stringify(result.choices[0].logprobs, null, 2)
    );

    expect(result).toBeDefined();
  }, 30000);
});

describe("DeepSeek Function Call", () => {
  it("should be defined", async () => {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY is not defined");
    }
    const deepSeek = new DeepSeek(apiKey);

    const request: ChatCompletionRequest = {
      messages: [
        {
          content: "你是一个天气查询机器人。",
          role: "system",
        },
        {
          content: "天津的天气怎么样？",
          role: "user",
        },
      ],
      model: "deepseek-chat",
      tools: [
        {
          type: "function",
          function: {
            name: "get_weather",
            description: "获取天气信息",
            parameters: {
              type: "object",
              properties: {
                city: {
                  type: "string",
                  description: "城市名称",
                },
              },
              required: ["city"],
            },
          },
        },
      ],
    };

    const result = await deepSeek.chat.completions.create(request);
    console.log("result1:", JSON.stringify(result));

    const toolCall = result.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call found");
    }
    console.log("toolCall:", JSON.stringify(toolCall, null, 2));

    request.messages.push(result.choices[0].message);
    request.messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: "温度 12 度，湿度 60%，天气晴朗，晚上可能下雨。",
    });

    const result2 = await deepSeek.chat.completions.create(request);
    console.log("result2:", JSON.stringify(result2));

    console.log("messages:", result.choices[0].message.content);

    expect(result).toBeDefined();
  }, 30000);
});
