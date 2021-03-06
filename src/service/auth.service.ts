import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSignInDto } from '../dto/auth.signin.dto';
import { AuthSignUpDto } from '../dto/auth.signup.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtPayload } from '../jwt-payload.interface';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { AccountsService } from 'src/service/accounts.service';
import * as bcrypt from 'bcrypt';
import { CategoriesService } from './categories.service';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private accountService: AccountsService,
        private categoriesService: CategoriesService
    ) {}

    createDefaultAccount(user: User) {
        const name: string = "general";
        const current_amount: number = 0;
        const date: Date = new Date();  
        this.accountService.createAccount({name, current_amount, date}, user);
    }

    async signUp(authSignUpDto: AuthSignUpDto): Promise<{ accessToken: string }> {
        const { name, email, password } = authSignUpDto;

        const user = new User();
        user.name = name;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.userRepository.hashPassword(password, user.salt);
        user.date = new Date();
        
        try {
            await user.save();
            const accessToken = this.signIn({email, password});
            this.createDefaultAccount(user);
            this.categoriesService.createDefaultCategories(user);
            
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
