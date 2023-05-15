import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
// import { Payload } from './payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger = new Logger('JwtStrategy');

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secretOrKey: 'SECRET_KEY_FOR_SIGN_JWT',
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: any, done: VerifiedCallback): Promise<any> {
    //this.logger.debug('validate :: ', payload)
    return done(null, payload);
  }
}
