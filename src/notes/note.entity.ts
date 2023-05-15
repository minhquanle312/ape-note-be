import { Member } from 'src/users/member.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
// import { User } from 'src/typeorm/entities/User.entity';
// import { Member } from 'src/typeorm/entities/Member.entity';

@Entity({ name: 'notes' })
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  isPin: boolean;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.notes)
  user: User;

  @OneToMany(() => Member, (member) => member.note, { cascade: true })
  members: Member[];
}
