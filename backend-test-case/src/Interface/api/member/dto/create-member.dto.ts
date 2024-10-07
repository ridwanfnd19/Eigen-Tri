import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({
    example: 'M001',
    required: true,
    uniqueItems: true,
  })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'Angga',
    required: true,
  })
  @IsNotEmpty()
  name: string;
}
