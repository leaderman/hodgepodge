import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import "reflect-metadata";
import { HelloController } from "./hello.controller";
import { User } from "./hello.entity";
import { HelloService } from "./hello.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule {}
