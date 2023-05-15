import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { Injectable } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {}

// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);
//     if (!token) {
//       throw new UnauthorizedException();
//     }
//     try {
//       // console.log('token in guard', token);
//       console.log('jwtService', this.jwtService);
//       // return true;
//       const payload = await this.jwtService.verifyAsync(token, {
//         // secret: process.env.JWT_KEY,
//         secret: 'SECRET_KEY_FOR_SIGN_JWT',
//       });

//       console.log('payload in guard', token);

//       request['user'] = payload;
//       // return payload;
//     } catch (err) {
//       console.log(2, err.message);
//       throw new UnauthorizedException();
//     }
//     return true;

//     // * Use later for cookie
//     // return request.session.userId;
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }
