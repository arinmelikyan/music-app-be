import { ObjectId } from 'mongoose';

export class CreateCommentDto {
  readonly username: string;
  readonly text: string;
  readonly trackId: ObjectId;
}

export class DeleteCommentDto {
  readonly trackId;
}

export class DeleteCommentResponseDto {
  readonly commentId;
  readonly message;
}
