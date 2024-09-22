import { Type } from "class-transformer";
import { IsNumber, IsString, Min, Max, IsOptional } from "class-validator";

export class GetHelloRo {
  @IsString()
  name!: string;
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(51)
  @Type(() => Number)
  age?: number;
}
