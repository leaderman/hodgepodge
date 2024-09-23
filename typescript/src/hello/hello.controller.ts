import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { instanceToPlain } from "class-transformer";
import { GetHelloRo, PostHelloRo, User } from "./hello.entity";
import { HelloService } from "./hello.service";

@Controller("hello")
export class HelloController {
  private readonly logger = new Logger(HelloController.name);

  constructor(
    private readonly helloService: HelloService,
    private readonly configService: ConfigService
  ) {}

  @Get("get")
  getHello(@Query() query: GetHelloRo): string {
    this.logger.log(JSON.stringify(query));
    this.logger.log(instanceToPlain(query));
    this.logger.log("NODE_ENV: " + process.env.NODE_ENV);
    this.logger.log("PROFILE: " + this.configService.get("CUSTOM_PROFILE"));
    this.logger.log("NAME: " + this.configService.get("CUSTOM_NAME"));

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

  @Get("error")
  getError(): string {
    throw new HttpException("This is a test error", HttpStatus.BAD_REQUEST);
  }
}
