import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSignInDto } from './dto/auth.signin.dto';
import { AuthSignUpDto } from './dto/auth.signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { AccountsService } from 'src/accounts/accounts.service';
import * as bcrypt from 'bcrypt';
import { AccountRepository } from 'src/accounts/account.repository';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { Account } from 'src/accounts/account.entity';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    createDefaultAccount(user: User) {
        console.log("get accounts " + user);
        // console.log(this.accountService.temp() + "obtained");
    }

    async signUp(authSignUpDto: AuthSignUpDto): Promise<{ accessToken: string }> {
        const { name, email, password } = authSignUpDto;

        const user = new User();
        user.name = name;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.userRepository.hashPassword(password, user.salt);
        
        try {
            await user.save();
            console.log("user signed up")
            const accessToken = this.signIn({email, password});
            console.log("user signed in")
            this.createDefaultAccount(user);
            console.log("user created account")
            return accessToken;
        } catch(error) {
            if(error.code === '23505') {
                throw new ConflictException("email already exists");
            } else {
                throw new InternalServerErrorException();
            }
        }
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
