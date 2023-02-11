import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { Album, AlbumDocument } from './schemas/album.schema';
import {
  CREATE_ALBUM_FAILED,
  GET_ALBUMS_FAILED,
  ALBUM_NOT_FOUND,
} from './errors';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const album = await this.albumModel.create(createAlbumDto);
    if (!album) {
      throw new HttpException(
        CREATE_ALBUM_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return album;
  }

  async getAll() {
    const albums = await this.albumModel.find();

    if (!albums) {
      throw new HttpException(
        GET_ALBUMS_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return albums;
  }

  async getOne(id: ObjectId) {
    const album = await this.albumModel.findById(id);

    if (!album) {
      throw new HttpException(ALBUM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return album;
  }

  async update(id: ObjectId, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.albumModel.findById(id);

    if (!album) {
      throw new HttpException(ALBUM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    album.update({ ...album, updateAlbumDto });
    album.save();
  }

  async remove(id: ObjectId) {
    const album = await this.albumModel.findByIdAndDelete(id);

    if (!album) {
      throw new HttpException(ALBUM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return { id: album._id, message: 'Album successfully deleted' };
  }
}
