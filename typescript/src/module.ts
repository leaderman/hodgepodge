import { Module } from "@nestjs/common";
import { HelloModule } from "./hello/hello.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", `.env.${process.env.NODE_ENV || "dev"}`],
    }),
    HelloModule,
  ],
})
export class AppModule {}
