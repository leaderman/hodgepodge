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

很多互联网从业者都很焦虑，35岁之后何去何从。

我个人的观察是，仅从行业角度来说， to B 对大龄从业者的友好程度要远高于to C 领域。

这些年移动互联网快速发展（加上中国经济高速增长），导致大众消费领域高速增长，到了现在，to C 领域基本饱和， to B 的优势就体现出来了。

你创业做个社交平台，今年融资几千万，辉煌无比，可能两三年后公司就要濒临破产。

但你做个to B的生意，能够在产业链中占据一席之地，有稳定的合作伙伴，基本上每年的订单都是非常稳定的。

to B 类公司死掉的原因除了自身确实不行外，大多都和经济大环境有关，比如说人力成本上涨、政策调整等等，大多数 to B 公司都能积累到一些竞争壁垒，整体竞争压力不会像to c 这种完全竞争市场那么激烈。

企业级用户对产品的需求，在满足业务需求的情况下，稳定高于一切。

所以我们常常在很多企业看到他们采用的设备都很「过时」——老旧的操作系统、上个时代的操作界面、对比大众消费品羸弱的性能，但这些对于企业级用户都不重要。

稳定、稳定、稳定，在此基础上，越便宜越好。

互联网说是一个行业，其实更应该被称之为一种产业模式。本质上，互联网企业比传统企业强大的地方，就在于它们通过将传统的商业模式，进行信息化、工业化改造，通过科学的技术手段来提高业务运行的效率，降低业务运行的成本。

所以国家提出的「互联网+」其内核，就是各行各业的产业升级，从老旧的传统生产模式，升级为先进的现代工业体系。

很多 to B的领域大众了解的不多，看起来平平无奇，但其市场空间要比大众消费品领域大得多。

举个例子。

中国目前的基建能力堪称世界第一，但这些超级工程的背后，需要非常多样化的技术支持。

我们的高铁速度可以跑得很快很快，但如果乘客入站的速度慢、效率低，那么发车频次、发车间隔都会受影响，反而会因为这种细节导致高铁整体效率的降低。

早些年高铁主流还是人工售票、人工检票的。

但现在国内的大城市基本普及了自助售票、取票，进站的时候，甚至直接刷身份者+人脸识别，就可以一秒进站了，这种智能的系统，背后就是信息化技术的支持。

当一个行业建立一套标准、规范后，就不会轻易改动，相关的企业合作也会保持着稳定、健康的关系。

这对于愿意深耕某个行业的人来说，其实是很好的事情。

to c 领域经历过数次风口的狂欢，除了早期完成大众消费品基础的一些业务外，后续比起产业升级更像是资本的投机手段。

在这点上， to B 领域则好得多。

而且 to B 领域对人员的要求，更看重其稳定性、专业度、丰富的行业经验，比起速度就是一切的to c领域， to B 市场整体更追求稳健，对年龄的要求则没有很严格。（不知道是不是我的错觉，个人体感 to B 类从业者的平均年龄要比to C类高很多）

之前和朋友聊中年危机，大家有个共识：

中年人不要再和年轻人进行同质化竞争，拼体力、拼创意，中年人都不占优势。

中年人应该发挥自己优势（经验、阅历、专业能力、成熟度、性格稳健）去做更有技术含量的事情。

有些领域天生就不适合年轻人做，这些领域才是中年人大有可为的地方。

所以比起焦虑中年危机，不如好好审视自己，换个赛道，换个角色，不要总想着和年轻人去竞争。

也许「退一步」就海阔天空了呢。
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
