import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSignInDto } from './dto/auth.signin.dto';
import { AuthSignUpDto } from './dto/auth.signup.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
        return this.userRepository.signUp(authSignUpDto);
    }

    async signIn(authSignInDto: AuthSignInDto): Promise<{ accessToken: string }> {
        const name = await this.userRepository.validateUserPassword(authSignInDto);
        
        if(!name) {
            throw new UnauthorizedException("Invalid credentials");
        }
    
        const payload: JwtPayload = { name };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }
}
