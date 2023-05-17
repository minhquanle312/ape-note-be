import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ILike, Repository } from 'typeorm';
import { Note } from './note.entity';
import { Member } from 'src/users/member.entity';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NoteQueryDto } from './dtos/note-query.dto';
import { CreateMemberDto } from './dtos/create-member.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Note) private noteRepo: Repository<Note>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
    private userService: UsersService,
  ) {}

  async addMemberToNote(
    noteId: number,
    body: CreateMemberDto,
    loggedInUser: User,
  ) {
    if (loggedInUser.email === body.email) {
      throw new BadRequestException('Can not add yourself to shared members.');
    }

    const member = this.memberRepo.create({ role: body.role });
    const note = await this.noteRepo.findOne({
      where: { id: noteId },
      relations: { members: { user: true } },
    });
    const membersId: number[] = [
      ...note.members.map((member: Member) => member.user.id),
    ];

    const user = await this.userService.findOneEmail(body.email);

    if (!user) {
      throw new BadRequestException('Email is not found');
    }

    if (membersId.includes(user.id)) {
      throw new BadRequestException('User is exist in this note');
    }
    member.note = note;
    member.user = user;

    return this.memberRepo.save(member);
  }

  deleteMember(id: number) {
    return this.memberRepo.delete({ id });
  }
}
