import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Note } from './notes/note.entity';
import { NotesModule } from './notes/notes.module';
import { Member } from './users/member.entity';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      // imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          // host: 'localhost',
          port: 3306,
          username: process.env.DB_USERNAME,
          // username: 'root',
          password: process.env.DB_PASSWORD,
          // password: 'P@ssWord123',
          database: 'test',
          entities: [User, Note, Member],
          synchronize: true,
        };
      },
    }),
    UsersModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['cookieKeyString'],
        }),
      )
      .forRoutes('*');
  }
}
