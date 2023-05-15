// import { User } from 'src/typeorm/entities/User.entity';
import { Note } from 'src/notes/note.entity';
import { MemberRole } from 'src/types/member.type';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
// import { Note } from './Note.entity';

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: MemberRole;

  @ManyToOne(() => Note, (note) => note.members)
  note: Note;

  @ManyToOne(() => User, (user) => user.members)
  user: User;
}
