import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsBoolean()
  @IsOptional()
  isPin?: boolean = false;
}
