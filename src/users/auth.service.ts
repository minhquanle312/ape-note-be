import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);

    if (users.length > 0) {
      throw new BadRequestException('Email in use');
    }

    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join hash result and salt together
    const result = salt + '.' + hash.toString('hex');

    const user = await this.userService.create(email, result);

    const payload = { email: user.email, id: user.id };

    console.log('process.env.DB_USERNAME', process.env.DB_USERNAME);
    console.log('process.env.JWT_KEY', process.env.JWT_KEY);
    console.log('payload', payload, this.jwtService.signAsync(payload));
    // const accessToken = await this.jwtService.signAsync(payload);

    return {
      ...user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    const payload = { email: user.email, id: user.id };

    // const accessToken = await this.jwtService.signAsync(payload);
    // console.log('accessToken', accessToken);

    return {
      ...user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
