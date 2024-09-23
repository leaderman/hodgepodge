import { HttpStatus, Injectable } from "@nestjs/common";
import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => ({
        code: HttpStatus.OK,
        message: HttpStatus[HttpStatus.OK],
        data,
      }))
    );
  }
}
