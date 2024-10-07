import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'JK-45',
    required: true,
    uniqueItems: true,
  })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'Harry Potter',
    required: true,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'J.K Rowling',
    required: true,
  })
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  stock: number;
}
