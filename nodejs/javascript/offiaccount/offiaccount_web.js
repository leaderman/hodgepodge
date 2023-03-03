import http from "http";
import url from "url";
import crypto from "crypto";
import xml2js from "xml2js";
import { Buffer } from "buffer";

import Config from "../config.js";

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

  seeds.sort();
  seeds = seeds.join("");

  const shasum = crypto.createHash("sha1");
  shasum.update(seeds);

  return shasum.digest("hex");
}

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

function jsonToXml(json) {
  const builder = new xml2js.Builder({
    headless: true,
  });

  return builder.buildObject(json);
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

async function deepWithWidePost(request, response) {
  const query = url.parse(request.url, true).query;

  const signature = query.signature;
  const timestamp = query.timestamp;
  const nonce = query.nonce;
  const openid = query.openid;
  const encryptType = query.encrypt_type;
  const msgSignature = query.msg_signature;

  let body = await getBody(request);
  console.log(body);
  body = await xmlToJson(body);
  console.log(body);

  const toUserName = body.xml.ToUserName;
  let encrypt = body.xml.Encrypt;

  let sign = getSign(
    Config.offiaccount_token_deepwithwide,
    timestamp,
    nonce,
    encrypt
  );

  let reci = decryptReci(encrypt);
  reci = await xmlToJson(reci);

  const content = reci.xml.Content;

  let resp = {};
  resp.xml = {};

  resp.xml.ToUserName = reci.xml.FromUserName;
  resp.xml.FromUserName = reci.xml.ToUserName;
  resp.xml.CreateTime = reci.xml.CreateTime;
  resp.xml.MsgType = reci.xml.MsgType;
  resp.xml.Content = reci.xml.Content;

  resp = jsonToXml(resp);

  encrypt = encryptResp(resp);

  sign = getSign(
    Config.offiaccount_token_deepwithwide,
    timestamp,
    nonce,
    encrypt
  );

  resp = {};
  resp.xml = {};

  resp.xml.Encrypt = encrypt;
  resp.xml.MsgSignature = sign;
  resp.xml.TimeStamp = timestamp;
  resp.xml.Nonce = nonce;

  resp = jsonToXml(resp);

  xml(response, resp);
}

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

function text(response, text) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/plain");
  response.end(text);
}

function xml(response, xml) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/xml");
  response.end(xml);
}

const port = Config.offiaccount_web_port;

const server = http.createServer((request, response) => {
  const path = url.parse(request.url).pathname;
  switch (path) {
    case "/offiaccount/deepwithwide":
      deepWithWide(request, response);
      break;
  }
});

server.listen(port, () => {
  console.log(`Server running on ${port}`);
});
