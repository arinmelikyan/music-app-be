import { PartialType } from '@nestjs/mapped-types';

export class CreateTrackDto {
  readonly name;
  readonly artist;
  readonly text;
}

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  readonly name?;
  readonly artist?;
  readonly text?;
}

export class DeleteTrackResponseDto {
  readonly trackId;
  readonly message;
}
