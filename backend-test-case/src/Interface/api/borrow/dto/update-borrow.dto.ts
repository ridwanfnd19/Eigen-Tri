import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, MinDate } from 'class-validator';
import dayjs from 'dayjs';

export class PatchBorrowReturnDto {
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
  returnDate: Date;
}
