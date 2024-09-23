import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    this.logger.error(JSON.stringify(exception));

    const code =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body = {
      code,
      message: HttpStatus[code],
      error:
        exception instanceof HttpException
          ? exception.getResponse()
          : exception,
      data: null,
    };

    this.httpAdapterHost.httpAdapter.reply(
      host.switchToHttp().getResponse(),
      body,
      HttpStatus.OK
    );
  }
}
