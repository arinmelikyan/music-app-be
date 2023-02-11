import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { TrackService } from './track.service';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { CreateCommentDto, DeleteCommentDto } from './dto/comment.dto';

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto, picture, audio) {
    return this.trackService.create(createTrackDto, picture, audio);
  }

  @Get()
  getAll() {
    return this.trackService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() updateTrackDto: UpdateTrackDto) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.trackService.remove(id);
  }

  @Post('/comment')
  addComment(@Body() createCommentDto: CreateCommentDto) {
    return this.trackService.addComment(createCommentDto);
  }

  @Post('/comment')
  removeComment(
    @Param('id') id: ObjectId,
    @Body() deleteCommentDto: DeleteCommentDto,
  ) {
    return this.trackService.removeComment(id, deleteCommentDto);
  }

  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id);
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.trackService.search(query);
  }
}
