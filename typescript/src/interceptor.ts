import { HttpStatus, Injectable } from "@nestjs/common";
import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
// import { UnauthorizedException } from "@nestjs/common";

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // const request = context.switchToHttp().getRequest();

    // const authHeader = request.headers["authorization"];
    // if (!authHeader) {
    //   throw new UnauthorizedException("No authorization token provided");
    // }

    return next.handle().pipe(
      map((data) => ({
        code: HttpStatus.OK,
        message: HttpStatus[HttpStatus.OK],
        data,
      }))
    );
  }
}
