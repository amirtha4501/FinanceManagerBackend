import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSignInDto } from './dto/auth.signin.dto';
import { AuthSignUpDto } from './dto/auth.signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
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

    async getUserById(user: User): Promise<User> {
        return user;
    }

    async updateUser(updateUserDto: UpdateUserDto, user: User): Promise<User> {
        
        const { name, email } = updateUserDto;
        
        user.name = name;

        if(await this.userRepository.findOne({ where: { email: email } })) {
            throw new ConflictException("email already exists");
        }
        user.email = email;
        
        try {
            await user.save();
        } catch {
            throw new BadRequestException("update failed");
        }

        return user;
    }

    async deleteUser(user: User): Promise<void> {

        const result = await this.userRepository.delete(user.id);
        
        if(result.affected === 0) {
            throw new NotFoundException(`User not found to delete`);
        }
    }
}
