import { PartialType } from '@nestjs/mapped-types';

export class CreateAlbumDto {
  readonly name;
  readonly artist;
  readonly description;
}

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}
