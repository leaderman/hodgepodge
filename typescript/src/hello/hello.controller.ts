import { Controller, Get, Query } from "@nestjs/common";
import { GetHelloRo, PostHelloRo, User } from "./hello.entity";
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

  @Get("users")
  getUsers(): Promise<User[]> {
    return this.helloService.getUsers();
  }

  @Post("user")
  saveUser(): Promise<User> {
    const user = new User();

    user.name = "John Doe";
    user.age = "20";
    user.email = "john.doe@example.com";
    user.hobbies = ["reading", "traveling"];
    user.detail = {
      height: 170,
      weight: 60,
      address: "123 Main St, Anytown, USA",
    };

    return this.helloService.saveUser(user);
  }
}
