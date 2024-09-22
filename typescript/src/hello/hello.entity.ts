import { Type } from "class-transformer";
import { IsNumber, IsString, Min, Max, IsOptional } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

export class PostHelloRo {
  @IsString()
  name!: string;
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(51)
  @Type(() => Number)
  age?: number;
}

export class UserDetail {
  height!: number;
  weight!: number;
  address!: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  age!: string;

  @Column()
  email!: string;

  @Column({ type: "json" })
  hobbies!: string[];

  @Column({ type: "json" })
  detail!: UserDetail;

  @Column({
    name: "created_at",
    type: "datetime",
  })
  createdAt!: Date;

  @Column({
    name: "updated_at",
    type: "datetime",
  })
  updatedAt!: Date;
}
