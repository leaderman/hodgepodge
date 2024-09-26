import { Constant } from "@typescript-park/balm";

export function greet(person: string): string {
  return "Hello, " + person + "!";
}

export function logMessage(message: string): void {
  console.log(message);
}

export function printConstant(): void {
  console.log(Constant.EMPTY);
  console.log(Constant.SPACE);
}
