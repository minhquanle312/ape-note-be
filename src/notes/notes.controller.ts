import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateNoteDto } from './dtos/create-note.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NoteQueryDto } from './dtos/note-query.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { NoteDto } from './dtos/note.dto';

@Controller('notes')
// @Serialize(NoteDto)
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get('/currentUserNote')
  @UseGuards(AuthGuard)
  getAllNoteOfCurrUser(@Request() req: any) {
    return this.notesService.findNotesOfUser(req.user.id);
  }

  // @Get()
  // getNotesQuery(@Query() query: GetEstimateDto) {
  //   return this.notesService.getNotesQuery(query);
  // }
  @Get()
  @UseGuards(AuthGuard)
  @Serialize(NoteDto)
  getQueryNote(@Query() query: NoteQueryDto, @Request() req: any) {
    return this.notesService.getQueryNote(query, req);
  }

  @Post()
  @UseGuards(AuthGuard)
  // @Serialize(NoteDto)
  createReport(@Body() body: CreateNoteDto, @CurrentUser() user: User) {
    return this.notesService.create(body, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getOneNote(@Param('id', ParseIntPipe) id: number) {
    const note = await this.notesService.findOneNote(id);
    console.log(id, note);
    return note;
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateNoteDto,
  ) {
    await this.notesService.updateNote(id, body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.notesService.deleteNote(id);
  }
}
