import http from "http";
import url from "url";
import crypto from "crypto";

import Config from "../config.js";
import { resolve } from "path";

function deepWithWideGet(request, response) {
  const query = url.parse(request.url, true).query;

  const signature = query.signature;
  const echostr = query.echostr;
  const timestamp = query.timestamp;
  const nonce = query.nonce;

  const token = Config.offiaccount_token_deepwithwide;

  let seeds = [token, timestamp, nonce];
  seeds.sort();
  seeds = seeds.join("");

  let shasum = crypto.createHash("sha1");
  shasum.update(seeds);
  const sign = shasum.digest("hex");

  if (signature === sign) {
    text(response, echostr);
  } else {
    text(response, "");
  }
}

async function deepWithWidePost(request, response) {
  const body = await getBody(request);
  console.log(body);

  text(response, "");
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
