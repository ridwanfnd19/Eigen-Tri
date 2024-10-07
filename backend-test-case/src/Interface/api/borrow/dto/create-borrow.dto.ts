import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID, MinDate } from 'class-validator';
import dayjs from 'dayjs';

export class CreateBorrowDto {
  @ApiProperty({
    example: 'd0e8d79b-7a47-4059-927d-7b44f3fdfc44',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsUUID('all')
  memberId: string;

  @ApiProperty({
    example: 'd0e8d79b-7a47-4059-927d-7b44f3fdfc44',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsUUID('all')
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({
    example: dayjs().format('YYYY-MM-DD'),
    required: true,
    type: Date,
  })
  @Type(() => Date)
  @MinDate(dayjs(dayjs().format('YYYY-MM-DD')).toDate())
  @IsNotEmpty()
  @IsDate()
  @IsNotEmpty()
  borrowedDate: Date;
}
