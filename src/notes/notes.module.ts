import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Note } from './note.entity';
import { Member } from 'src/users/member.entity';
import { MembersService } from './members.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Note, Member])],
  controllers: [NotesController],
  providers: [NotesService, MembersService, UsersService],
})
export class NotesModule {}
