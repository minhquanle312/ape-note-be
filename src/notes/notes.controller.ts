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
import { MembersService } from './members.service';
import { CreateMemberDto } from './dtos/create-member.dto';
import { MemberDto } from './dtos/member.dto';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('notes')
// @Serialize(NoteDto)
export class NotesController {
  constructor(
    private notesService: NotesService,
    private membersService: MembersService,
  ) {}

  @Get('/currentUserNote')
  @UseGuards(AuthGuard)
  getAllNoteOfCurrUser(@Request() req: any) {
    return this.notesService.findNotesOfUser(req.user.id);
  }

  @Get('/sharedWithMe')
  @UseGuards(AuthGuard)
  getAllSharedNotes(@CurrentUser() user: User) {
    return this.notesService.getAllSharedNote(user);
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

  @Delete('members/:id')
  deleteMember(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.deleteMember(id);
  }

  // @Get(':noteId/members')
  // @UseGuards(AuthGuard)
  // getAllMember(@Param('noteId', ParseIntPipe) nodeId: number) {
  //   return this.membersService.getAllMemberOfNote(nodeId);
  // }

  @Get(':id')
  @UseGuards(AuthGuard)
  getOneNote(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.findOneNote(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateNoteDto,
  ) {
    await this.notesService.updateNote(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.notesService.deleteNote(id);
  }

  // * Handle Member api
  @Post(':noteId/members')
  @UseGuards(AuthGuard)
  addMemberToNote(
    @Param('noteId', ParseIntPipe) noteId: number,
    @Body() body: CreateMemberDto,
    @CurrentUser() user: User,
  ) {
    return this.membersService.addMemberToNote(noteId, body, user);
  }
}
