import axios from "axios";

export class DeepSeek {
  _baseURL: string;
  _token: string;

  constructor(token: string, baseURL = "https://api.deepseek.com/v1") {
    this._baseURL = baseURL;
    this._token = token;
  }

  chat: Chat = new Chat(this);

  async post(
    path: string,
    data: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const response = await axios.post(`${this._baseURL}${path}`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${this._token}`,
      },
    });
    return response.data;
  }
}

class ApiResource {
  _client: DeepSeek;

  constructor(client: DeepSeek) {
    this._client = client;
  }
}

class Chat extends ApiResource {
  completions: Completions = new Completions(this._client);
}

interface ApiEndpoint<T, U> {
  create(request: T): Promise<U>;
}

class Completions
  extends ApiResource
  implements ApiEndpoint<ChatCompletionRequest, ChatCompletionResponse>
{
  create(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    return this._client.post("/chat/completions", request);
  }
}

export interface ChatCompletionRequest {
  messages: Message[];
  model: string;
  frequency_penalty?: number;
  max_tokens?: number;
  presence_penalty?: number;
  response_format?: ResponseFormat;
  stop?: string | string[];
  stream?: boolean;
  stream_options?: StreamOptions;
  temperature?: number;
  top_p?: number;
  tools?: FunctionTool[];
  tool_choice?:
    | "none"
    | "auto"
    | "required"
    | { type: "function"; function: { name: string } };
  logprobs?: boolean;
  top_logprobs?: number;
}

export interface Message {
  content?: string;
  role: "system" | "user" | "assistant" | "tool";
  name?: string;
  tool_call_id?: string;
  tool_calls?: FunctionToolCall[];
}

export interface ResponseFormat {
  type: "text" | "json_object";
}

export interface StreamOptions {
  include_usage: boolean;
}

export interface Tool {
  type: string;
}

export interface FunctionTool extends Tool {
  type: "function";
  function: Function;
}

export interface Function {
  description: string;
  name: string;
  parameters: {
    type: "object";
    properties: {
      [key: string]: {
        type: string;
        description: string;
      };
    };
    required: string[];
  };
}

export interface ChatCompletionResponse {
  id: string;
  choices: Choice[];
  created: number;
  model: string;
  system_fingerprint: string;
  object: "chat.completion";
  usage: Usage;
}

export interface Choice {
  finish_reason:
    | "stop"
    | "length"
    | "content_filter"
    | "tool_calls"
    | "insufficient_system_resource";
  index: number;
  message: {
    content?: string;
    tool_calls?: FunctionToolCall[];
    role: "assistant";
  };
  logprobs?: {
    content?: {
      token: string;
      logprob: number;
      bytes: number[];
      top_logprobs: {
        token: string;
        logprob: number;
        bytes: number[];
      }[];
    }[];
  };
}

export interface ToolCall {
  id: string;
  type: string;
}

export interface FunctionToolCall extends ToolCall {
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface Usage {
  completion_tokens: number;
  prompt_tokens: number;
  prompt_cache_hit_tokens: number;
  prompt_cache_miss_tokens: number;
  total_tokens: number;
}
