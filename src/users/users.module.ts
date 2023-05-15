import { Module } from '@nestjs/common';
// import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';
// import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { Note } from 'src/notes/note.entity';
import { Member } from './member.entity';
import { JwtStrategy } from 'src/guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Note, Member]),
    // JwtModule.registerAsync({
    //   global: true,
    //   // secret: process.env.JWT_KEY,
    //   secret: 'SECRET_KEY_FOR_SIGN_JWT',
    //   signOptions: { expiresIn: '1d' },
    // }),
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: `.env.${process.env.NODE_ENV}`,
    // }),
    JwtModule.registerAsync({
      // inject: [ConfigService],
      // imports: [ConfigModule],
      useFactory: async () => {
        return {
          // secret: 'SECRET_KEY_FOR_SIGN_JWT',
          secret: process.env.JWT_KEY,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    PassportModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtStrategy],
})
export class UsersModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(CurrentUserMiddleware).forRoutes('*');
  // }
}
