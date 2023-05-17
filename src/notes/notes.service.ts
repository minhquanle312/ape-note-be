import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ILike, Repository } from 'typeorm';
import { Note } from './note.entity';
import { Member } from 'src/users/member.entity';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NoteQueryDto } from './dtos/note-query.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Note) private noteRepo: Repository<Note>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
  ) {}

  create(noteDto: CreateNoteDto, user: User) {
    const note = this.noteRepo.create(noteDto);
    note.user = user;

    return this.noteRepo.save(note);
  }

  async findNotesOfUser(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['notes'],
    });
    if (!user)
      throw new NotFoundException('User not found. Cannot create Profile');

    return user.notes;
  }

  getQueryNote(query: NoteQueryDto, req: any) {
    const { queryString } = query;
    // return this.noteRepo
    //   .createQueryBuilder()
    //   .where('userId = :userId', { userId: req.user.id })
    //   .andWhere('title like :title', { title: `%${queryString}%` })
    //   .orWhere('content like :content', { content: `%${queryString}%` })
    //   .getMany();
    return this.noteRepo.find({
      where: [
        {
          userId: req.user.id,
          title: ILike(`%${queryString}%`),
        },
        {
          userId: req.user.id,
          content: ILike(`%${queryString}%`),
        },
      ],
    });
  }

  findOneNote(id: number) {
    if (!id) return null;

    return this.noteRepo.findOne({
      where: { id },
      relations: {
        members: {
          user: true,
        },
      },
    });
  }

  updateNote(id: number, body: UpdateNoteDto) {
    return this.noteRepo.update({ id }, body);
  }

  async deleteNote(id: number) {
    await this.memberRepo.delete({ note: { id } });

    return this.noteRepo.delete({ id });
  }

  async getAllSharedNote(user: User) {
    const membersIn = await this.memberRepo.find({
      where: { user: { id: user.id } },
      relations: {
        note: true,
      },
    });
    const notesList = membersIn.map((item: any) => item.note);
    return notesList;
  }
}
