import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateTrackDto,
  UpdateTrackDto,
  DeleteTrackResponseDto,
} from './dto/track.dto';
import {
  CreateCommentDto,
  DeleteCommentDto,
  DeleteCommentResponseDto,
} from './dto/comment.dto';
import { Track, TrackDocument } from './schemas/track.schema';
import { CommentDocument, Comment } from './schemas/comment.schema';
import {
  TRACK_NOT_FOUND,
  COMMENT_NOT_FOUND,
  CREATE_TRACK_FAILED,
  GET_TRACKS_FAILED,
} from './errors';
import { FileService, FileType } from '../file/file.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(createTrackDto: CreateTrackDto, picture, audio): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const track = this.trackModel.create({
      ...createTrackDto,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
    });

    if (!track) {
      throw new HttpException(
        CREATE_TRACK_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return track;
  }

  async getAll(): Promise<Track[]> {
    const tracks = await this.trackModel.find();
    if (!tracks) {
      throw new HttpException(
        GET_TRACKS_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return tracks;
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new HttpException(TRACK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return track;
  }

  async update(id: ObjectId, updateTrackDto: UpdateTrackDto) {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new HttpException(TRACK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    track.update({ ...track, updateTrackDto });
    track.save();
  }

  async listen(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new HttpException(TRACK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    track.listens += 1;
    track.save();
  }

  async remove(id: ObjectId): Promise<DeleteTrackResponseDto> {
    const track = await this.trackModel.findByIdAndDelete(id);
    if (!track) {
      throw new HttpException(TRACK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return { trackId: track._id, message: 'track was successfully deleted' };
  }

  async addComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(createCommentDto.trackId);

    if (!track) {
      throw new HttpException(TRACK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const comment = await this.commentModel.create({ ...createCommentDto });
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async removeComment(
    id: ObjectId,
    deleteCommentDto: DeleteCommentDto,
  ): Promise<DeleteCommentResponseDto> {
    const comment = await this.commentModel.findByIdAndDelete(id);
    if (!comment) {
      throw new HttpException(COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const track = await this.trackModel.findById(deleteCommentDto.trackId);
    track.comments.filter((commentId) => commentId !== id);
    return {
      commentId: comment._id,
      message: 'Comment has been successfully deleted',
    };
  }

  async search(query: string) {
    return query;
  }
}
