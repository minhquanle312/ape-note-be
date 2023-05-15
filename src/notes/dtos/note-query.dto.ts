import { IsString } from 'class-validator';

export class NoteQueryDto {
  @IsString()
  queryString: string;
}
