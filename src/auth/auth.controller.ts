import { Body, Controller, Delete, ExecutionContext, forwardRef, Get, Inject, Param, ParseIntPipe, Patch, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth.signin.dto';
import { AuthSignUpDto } from './dto/auth.signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authSignUpDto: AuthSignUpDto): Promise<{ accessToken: string }> {
        const accessToken = this.authService.signUp(authSignUpDto);
        return accessToken;
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authSignInDto: AuthSignInDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authSignInDto);
    }

    @Get('')
    @UseGuards(AuthGuard())
    getUserById(
        @GetUser() user: User
    ): Promise<User> {
        return this.authService.getUserById(user);
    }

    @Patch('')
    @UseGuards(AuthGuard())
    updateUser(
        @Body(ValidationPipe) updateUserDto: UpdateUserDto,
        @GetUser() user: User
    ): Promise<User> {
        return this.authService.updateUser(updateUserDto, user);
    }

    @Delete('') 
    @UseGuards(AuthGuard())
    deleteUser(
        @GetUser() user: User
    ): Promise<void> {
        return this.authService.deleteUser(user);
    }
}
