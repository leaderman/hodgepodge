import { Controller, Get, Query } from "@nestjs/common";
import { GetHelloRo, PostHelloRo } from "./hello.entity";
import { HelloService } from "./hello.service";
import { ConfigService } from "@nestjs/config";
import { Body, Post } from "@nestjs/common";

@Controller("hello")
export class HelloController {
  constructor(
    private readonly helloService: HelloService,
    private readonly configService: ConfigService
  ) {}

  @Get("get")
  getHello(@Query() query: GetHelloRo): string {
    console.log(query);
    console.log("NODE_ENV: " + process.env.NODE_ENV);
    console.log("PROFILE: " + this.configService.get("CUSTOM_PROFILE"));
    console.log("NAME: " + this.configService.get("CUSTOM_NAME"));
    return this.helloService.getHello(query.name);
  }

  @Post("post")
  postHello(@Body() body: PostHelloRo): object {
    console.log(body);
    return { result: this.helloService.getHello(body.name) };
  }
}
