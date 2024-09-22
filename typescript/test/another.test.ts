import { another } from "../src/another";

describe("another", () => {
  it("should return another", async () => {
    await expect(another()).resolves.not.toThrow();
  }, 10000);
});
