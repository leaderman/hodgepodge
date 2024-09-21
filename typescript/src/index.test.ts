import { greet, logMessage } from "./index";

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
