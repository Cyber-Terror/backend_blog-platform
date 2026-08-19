import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment to post',
    default: '<3',
    type: String,
  })
  @MinLength(1)
  @IsString()
  content: string;
}
