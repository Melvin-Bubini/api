import { Injectable } from "@nestjs/common";
import { User } from "./user.model";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(name: string, email: string, password: string): Promise<User> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { email } });
    
            if (existingUser) {
                throw new Error("E-postadressen är redan registrerad");
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = this.userRepository.create({ name, email, password: hashedPassword });
            return await this.userRepository.save(newUser);
        } catch (error) {
            console.error("Fel vid registrering:", error.message);
            throw new Error("Något gick fel vid registrering");
        }
    }
    

    async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }
}