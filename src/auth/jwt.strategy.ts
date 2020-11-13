import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // secretOrKey: process.env.MY_PASSWORD, // jwt password
            secretOrKey: 'password', // jwt password
        })
    }

    async validate(payload: JwtPayload) {
        const { name } = payload;
        const user = await this.userRepository.findOne({ name });

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}