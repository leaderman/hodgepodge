import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./hello.entity";

@Injectable()
export class HelloService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  getHello(name: string): string {
    return "Hello " + name + "!";
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
