import { Controller, Get, Query } from "@nestjs/common";
import { GetHelloRo } from "./hello.entity";
import { HelloService } from "./hello.service";
@Controller("hello")
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get("get")
  getHello(@Query() query: GetHelloRo): string {
    console.log(query);
    return this.helloService.getHello(query.name);
  }
}
