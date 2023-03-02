import http from "http";
import url from "url";
import crypto from "crypto";

import Config from "../config.js";

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

function deepWithWidePost(request, response) {}

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
  console.log("Server running ...");
});
