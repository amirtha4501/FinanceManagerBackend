import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth.signin.dto';
import { AuthSignUpDto } from './dto/auth.signup.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authSignUpDto: AuthSignUpDto): Promise<void> {
        return this.authService.signUp(authSignUpDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authSignInDto: AuthSignInDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authSignInDto);
    }
}
