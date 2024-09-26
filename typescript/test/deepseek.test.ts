import { DeepSeek } from "../src/deepseek";
import { ChatCompletionRequest } from "../src/deepseek";

describe("DeepSeek", () => {
  it("should be defined", async () => {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY is not defined");
    }
    const deepSeek = new DeepSeek(apiKey);

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

describe("Translate", () => {
  it("should be defined", async () => {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY is not defined");
    }
    const deepSeek = new DeepSeek(apiKey);

    const result = await deepSeek.chat.completions.create({
      messages: [
        {
          content: `
你是一位精通中文和英文的专业翻译，翻译流程分成三个步骤：

1. 根据中文内容进行直译，保持原有格式，不要遗漏任何信息；
2. 根据第一个步骤的直译结果，明确指出其中可能存在的问题，包括但不限于以下若干项：
  a. 语境理解：深入理解原文的文化背景、语气和目的；
  b. 准确度：确保翻译内容的准确性，避免误解；
  c. 流畅性：翻译后的内容应自然流畅，符合英语表达习惯；
  d. 专业术语：准确翻译专业术语，必要时提供解释；
  e. 文化适应性：考虑文化差异，避免直译引起误解；
  f. 避免冗余：简洁表达，避免不必要的重复；
  g. 标点符号：注意中英文标点的差异；
  h. 一致性：保持术语、人名、地名的一致性；

  每一项都可以有一个或多个问题；
3. 综合第一个步骤的直译结果和第二个步骤的问题，重新进行意译，使用翻译的结果更加贴近中文语言的读者，提高翻译的质量和效果。

按下述格式输出三个步骤各自的结果：

直译结果

{{直译结果}}

问题列表

{{问题列表}}

意译结果

{{意译结果}}

特别注意：“{{...}}” 是结果占位符号，实际输出结果时需要整体替换掉，以及去除 “{{” 和 “}}”。
          `,
          role: "system",
        },
        {
          content: `
中文内容如下：

哈哈，我跟斌叔想的还真差不多。

讲真，我一直担心自己会不会比较幼稚，毕竟从事创业前都在搞学术，很多创业人都是企业工作了好几年的。于是有段时间我看了很多business的书狂补知识。

我看过印象很深刻的一段话是“市场上那么多咖啡品牌味道也差不多，为什么还会有人选择性地购买？ 因为咖啡有很多人喝，有的人主观上感受这些牌子是有区别的，只是你感受不到，所以没有去挑。换成啤酒，和牙膏这个道理差不多。“ （好像是来自于The Minimalist Entrepreneur) 所以，第一点，有人在用这些东西，就有细分市场，你就有可能做到一个细分市场。

第二点，我听过很多很多人说自己的创新idea，重点都是放在这个idea是全新的没人做过，却不是放在“我们的技术有这个突破，市场同类产品都没有我们好”。
          `,
          role: "user",
        },
      ],
      model: "deepseek-chat",
    });

    console.log("messages:", result.choices[0].message.content);
    console.log("total_tokens:", result.usage.total_tokens);

    expect(result).toBeDefined();
  }, 600000);
});
