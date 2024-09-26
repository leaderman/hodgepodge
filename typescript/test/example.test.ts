import { greet, logMessage, printConstant } from "../src/example";

describe("greet", () => {
  it("should return a greeting message", () => {
    expect(greet("World")).toBe("Hello, World!");
  });
});

describe("logMessage", () => {
  it("should print a message", () => {
    expect(() => logMessage("Hello, World!")).not.toThrow();
  });
});

describe("printConstant", () => {
  it("should print a constant", () => {
    expect(() => printConstant()).not.toThrow();
  });
});
