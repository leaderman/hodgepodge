import http from "http";
import url from "url";
import crypto from "crypto";
import xml2js from "xml2js";
import { Buffer } from "buffer";

import Config from "../config.js";

/**
 * XML 转换 JSON。
 *
 * @param {String} xml XML
 * @returns {Object} JSON
 */
async function xmlToJson(xml) {
  const parser = new xml2js.Parser({ explicitArray: false });

  return new Promise((resolve, reject) => {
    parser.parseString(xml, (error, json) => {
      if (error) {
        reject(error);
      }

      resolve(json);
    });
  });
}

/**
 * JSON 转换 XML。
 *
 * @param {Object} json JSON
 * @returns {String} XML
 */
function jsonToXml(json) {
  const builder = new xml2js.Builder({
    headless: true,
  });

  return builder.buildObject(json);
}

/**
 * 签名。
 *
 * @param {String} token 微信开放平台上，服务方设置的接收消息的校验 token
 * @param {String} timestamp URL 上原有参数,时间戳
 * @param {String} nonce URL 上原有参数,随机数
 * @param {String} encrypt 密文
 * @returns {String} 签名
 */
function getSign(token, timestamp, nonce, encrypt) {
  let seeds = [];

  if (token) {
    seeds.push(token);
  }

  if (timestamp) {
    seeds.push(timestamp);
  }

  if (nonce) {
    seeds.push(nonce);
  }

  if (encrypt) {
    seeds.push(encrypt);
  }

  // 字典序
  seeds.sort();
  seeds = seeds.join("");

  const shasum = crypto.createHash("sha1");
  shasum.update(seeds);

  return shasum.digest("hex");
}

/**
 * 加密。
 *
 * @param {String} text 明文
 * @returns {String} 密文
 */
function encryptResp(text) {
  const algorithm = "aes-256-cbc";
  const key = Buffer.from(
    Config.offiaccount_encoding_aes_key_deepwithwide + "=",
    "base64"
  );
  const iv = key.subarray(0, 16);

  // random(16B)
  const random = crypto.randomBytes(16);

  // msg
  const msg = Buffer.from(text);

  // msg_len(4B)
  const msgLength = Buffer.alloc(4);
  msgLength.writeUInt32BE(msg.length, 0);

  // appid
  const appid = Buffer.from(Config.offiaccount_appid_deepwithwide);

  // random(16B) + msg_len(4B) + msg + appid
  let encrypt = Buffer.concat([random, msgLength, msg, appid]);

  // 添加 PKCS#7 填充
  const blockSize = key.length;
  const padLength = blockSize - (encrypt.length % blockSize);

  const pad = Buffer.alloc(padLength);
  pad.fill(padLength);

  encrypt = Buffer.concat([encrypt, pad]);

  // 加密器
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  cipher.setAutoPadding(false);

  // 加密
  encrypt = Buffer.concat([cipher.update(encrypt), cipher.final()]);

  // 编码
  return encrypt.toString("base64");
}

/**
 * 解密。
 *
 * @param {String} encrypt 密文
 * @returns {String} 明文
 */
function decryptReci(encrypt) {
  const algorithm = "aes-256-cbc";
  const key = Buffer.from(
    Config.offiaccount_encoding_aes_key_deepwithwide + "=",
    "base64"
  );
  const iv = key.subarray(0, 16);

  // 解密器
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAutoPadding(false);

  // 解密（解码）
  let decrypt = Buffer.concat([
    decipher.update(encrypt, "base64"),
    decipher.final(),
  ]);

  // 去除 PKCS#7 填充
  decrypt = decrypt.subarray(0, decrypt.length - decrypt[decrypt.length - 1]);

  // 去除 random(16B)
  decrypt = decrypt.subarray(16);

  // 消息长度
  const length = decrypt.subarray(0, 4).readUInt32BE(0);

  // 去除 msg_len(4B)
  decrypt = decrypt.subarray(4);

  // msg
  const msg = decrypt.subarray(0, length).toString();
  // appid
  const appid = decrypt.subarray(length).toString();

  return msg;
}

/**
 * 获取 POST 请求体。
 *
 * @param {Object} request 请求
 * @returns {Promise<String>} 请求体
 */
async function getBody(request) {
  return new Promise((resolve, _) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      resolve(body);
    });
  });
}

/**
 * 构建原生响应消息。
 *
 * @param {String} toUserName 接收方账号
 * @param {String} fromUserName 发送方账号
 * @param {String} createTime 消息创建时间
 * @param {String} content 消息内容
 * @returns {String} 原生响应消息（XML）
 */
function generateNative(toUserName, fromUserName, createTime, content) {
  const native = {};
  native.xml = {};

  native.xml.ToUserName = fromUserName;
  native.xml.FromUserName = toUserName;
  native.xml.CreateTime = createTime;
  native.xml.MsgType = "text";
  native.xml.Content = content;

  return jsonToXml(native);
}

/**
 * 构建包装响应消息。
 *
 * @param {String} timestamp URL 上原有参数
 * @param {String} nonce URL 上原有参数
 * @param {String} encrypt 密文
 * @returns {String} 包装响应消息（XML）
 */
function generateWrap(timestamp, nonce, encrypt) {
  const sign = getSign(
    Config.offiaccount_token_deepwithwide,
    timestamp,
    nonce,
    encrypt
  );

  const wrap = {};
  wrap.xml = {};

  wrap.xml.Encrypt = encrypt;
  wrap.xml.MsgSignature = sign;
  wrap.xml.TimeStamp = timestamp;
  wrap.xml.Nonce = nonce;

  return jsonToXml(wrap);
}

/**
 * 响应文本。
 *
 * @param {Object} response 响应
 * @param {String} text 文本
 */
function text(response, text) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/plain");
  response.end(text);
}

/**
 * 响应 XML。
 *
 * @param {Object} response 响应
 * @param {String} xml XML
 */
function xml(response, xml) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/xml");
  response.end(xml);
}

/**
 * 响应错误。
 *
 * @param {Object} response 响应
 * @param {String} text 文本
 */
function error(response, text) {
  response.statusCode = 500;
  response.setHeader("Content-Type", "text/plain");
  response.end(text);
}

/**
 * 公众号 GET 请求，用于验证微信服务器消息。
 *
 * @param {Object} request 请求
 * @param {Object} response 响应
 */
function deepWithWideGet(request, response) {
  const query = url.parse(request.url, true).query;

  const signature = query.signature;
  const echostr = query.echostr;
  const timestamp = query.timestamp;
  const nonce = query.nonce;

  const sign = getSign(Config.offiaccount_token_deepwithwide, timestamp, nonce);
  if (signature === sign) {
    text(response, echostr);
  } else {
    text(response, "");
  }
}

/**
 * 公众号 POST 请求。
 *
 * @param {Object} request 请求
 * @param {Object} response 响应
 */
async function deepWithWidePost(request, response) {
  const query = url.parse(request.url, true).query;

  const signature = query.signature;
  const timestamp = query.timestamp;
  const nonce = query.nonce;
  const openid = query.openid;

  const encryptType = query.encrypt_type;
  if (encryptType !== "text") {
    // 非文本消息，不处理
    text(response, "success");

    return;
  }

  const msgSignature = query.msg_signature;

  let body = await getBody(request);
  body = await xmlToJson(body);

  // 密文
  let encrypt = body.xml.Encrypt;

  let sign = getSign(
    Config.offiaccount_token_deepwithwide,
    timestamp,
    nonce,
    encrypt
  );
  if (msgSignature !== sign) {
    error(response, "签名错误");

    return;
  }

  // 解密
  let reci = decryptReci(encrypt);
  reci = await xmlToJson(reci);

  // 消息
  const content = reci.xml.Content;

  // 原生消息
  const native = generateNative(
    reci.xml.FromUserName,
    reci.xml.ToUserName,
    reci.xml.CreateTime,
    reci.xml.Content
  );

  // 加密原生消息
  encrypt = encryptResp(resp);

  // 包装消息
  const wrap = generateWrap(timestamp, nonce, encrypt);

  // 响应
  xml(response, wrap);
}

/**
 * 公众号请求。
 *
 * @param {Object} request 请求
 * @param {Object} response 响应
 */
function deepWithWide(request, response) {
  const method = request.method;
  switch (method) {
    case "GET":
      deepWithWideGet(request, response);
      break;

    case "POST":
      deepWithWidePost(request, response);
      break;
  }
}

// 端口
const port = Config.offiaccount_web_port;

const server = http.createServer((request, response) => {
  const path = url.parse(request.url).pathname;
  switch (path) {
    case "/offiaccount/deepwithwide":
      deepWithWide(request, response);
      break;
  }
});

// 服务监听
server.listen(port, () => {
  console.log(`Server running on ${port}`);
});
