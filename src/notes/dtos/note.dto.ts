import { Expose, Exclude } from 'class-transformer';

export class NoteDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: boolean;

  @Expose()
  userId: number;
}
