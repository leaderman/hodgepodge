import COS from "cos-nodejs-sdk-v5";

const cos = new COS({
  SecretId: process.env.SecretId,
  SecretKey: process.env.SecretKey,
});

const filePath = "/tmp/hello_word.wav"; // 本地文件路径
const key = "speech/word/hello_word.wav";

function uploadFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cos.uploadFile(
      {
        Bucket: "tea-1304934178", // 填入您自己的存储桶，必须字段
        Region: "ap-beijing", // 存储桶所在地域，例如 ap-beijing，必须字段
        Key: key, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
        FilePath: filePath, // 必须
      },
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

uploadFile(filePath);

function getObjectUrl(key: string): string {
  return cos.getObjectUrl(
    {
      Bucket: "tea-1304934178", // 填入您自己的存储桶，必须字段
      Region: "ap-beijing", // 存储桶所在地域，例如 ap-beijing，必须字段
      Key: key, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
    },
    () => {}
  );
}

const url = getObjectUrl(key);
console.log(url);
