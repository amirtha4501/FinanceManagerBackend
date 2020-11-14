import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User } from "./user.entity";
import { AuthSignInDto } from "./dto/auth.signin.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async validateUserPassword(authSignInDto: AuthSignInDto): Promise<string> {
        const { email, password } = authSignInDto;
        const user = await this.findOne({ email });

        if(user && await user.validatePassword(password)) {
            return user.name;
        } else {
            return null;
        }
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}