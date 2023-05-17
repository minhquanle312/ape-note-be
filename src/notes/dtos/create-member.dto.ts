import { IsEmail, IsString } from 'class-validator';
import { MemberRole } from 'src/types/member.type';

export class CreateMemberDto {
  @IsString()
  role: MemberRole;

  @IsEmail()
  email: string;
}
