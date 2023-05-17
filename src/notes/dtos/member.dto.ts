import { IsString } from 'class-validator';
import { MemberRole } from 'src/types/member.type';

export class MemberDto {
  @IsString()
  role: MemberRole;

  userId: number;

  noteId: number;
}
