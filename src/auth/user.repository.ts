import { ConflictException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthSignUpDto } from "./dto/auth.signup.dto";
import * as bcrypt from 'bcrypt';
import { User } from "./user.entity";
import { AuthSignInDto } from "./dto/auth.signin.dto";
// import { JwtPayload } from "./jwt-payload.interface";
// import { JwtService } from "@nestjs/jwt";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    // constructor(
    //     private jwtService: JwtService
    // ) {
    //     super();
    // }

    // async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
    //     const { name, email, password } = authSignUpDto;

    //     const user = new User();
    //     user.name = name;
    //     user.email = email;
    //     user.salt = await bcrypt.genSalt();
    //     user.password = await this.hashPassword(password, user.salt);
        
    //     try {
    //         await user.save();
    //         console.log(await this.signIn({email, password}));
    //     } catch(error) {
    //         if(error.code === '23505') {
    //             throw new ConflictException("email already exists");
    //         } else {
    //             throw new InternalServerErrorException();
    //         }
    //     }
    // }

    // async signIn(authSignInDto: AuthSignInDto): Promise<{ accessToken: string }> {
    //     console.log('calling signin' + authSignInDto.email + ' ' + authSignInDto.password);
    //     const name = await this.validateUserPassword(authSignInDto);
        
    //     if(!name) {
    //         throw new UnauthorizedException("Invalid credentials");
    //     }
    
    //     const payload: JwtPayload = { name };
    //     const accessToken = await this.jwtService.sign(payload);

    //     return { accessToken };
    // }

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