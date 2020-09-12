import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthSignUpDto } from "./dto/auth.signup.dto";
import * as bcrypt from 'bcrypt';
import { User } from "./user.entity";
import { AuthSignInDto } from "./dto/auth.signin.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
        const { name, email, password } = authSignUpDto;

        const user = new User();
        user.name = name;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        
        console.log(user.password);

        try {
            await user.save();
        } catch (error) {
            if(error.code === '23505') {
                throw new ConflictException("email already exists");
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authSignInDto: AuthSignInDto): Promise<string> {
        const { email, password } = authSignInDto;
        const user = await this.findOne({ email });

        if(user && await user.validatePassword(password)) {
            return user.name;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}