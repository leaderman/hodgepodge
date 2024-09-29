import { getWeibo } from "../src/weibo";

describe("getWeibo", () => {
  it("should return a weibo object", async () => {
    await expect(getWeibo()).resolves.not.toThrow();
  }, 600000);
});
