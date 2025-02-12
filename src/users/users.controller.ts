import { Controller, Post, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) { }
    @Post("register")
    async addUser(
        @Body("name") name: string,
        @Body("email") email: string,
        @Body("password") password: string,
    ): Promise<any> {
        const user = await this.usersService.createUser(name, email, password);
        return { message: "Användare skapad", userId: user.id };
    }

    @Post("login")
    async loginUser(@Body("email") email: string, @Body("password") password: string): Promise<any> {
        try {
            const user = await this.usersService.findUserByEmail(email);

            if (!user || !user.password) {
                throw new Error("Användaren eller lösenord saknas");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Felaktigt lösenord");
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, "jwt_token", { expiresIn: "1h" });
            return { message: "Inloggning lyckades", token };
        } catch (error) {
            console.error("Fel vid inloggning:", error.message);
            throw new Error("Inloggning misslyckades");
        }
    }

}