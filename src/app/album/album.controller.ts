import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  getAll() {
    return this.albumService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.albumService.getOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.albumService.remove(id);
  }
}
