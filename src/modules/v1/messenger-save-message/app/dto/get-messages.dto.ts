import { ApiProperty } from "@nestjs/swagger";

export enum GetMessagesTypes {
  pagination = "pagination",
  before_date = "before_date",
  after_date = "after_date",
  unseen = "unseen",
}

export class GetMessagesDto {
  @ApiProperty()
  key: string;

  @ApiProperty({ enum: GetMessagesTypes, default: GetMessagesTypes.pagination })
  type: GetMessagesTypes;

  @ApiProperty({ required: false })
  date: string;

  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  per_page: number;
}
