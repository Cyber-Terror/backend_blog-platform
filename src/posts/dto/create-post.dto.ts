import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: "Post's title, minimal length 3",
    default: 'post',
    type: String,
  })
  @MinLength(3)
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content to post, minimal length 2 ',
    default: 'content',
    type: String,
  })
  @MinLength(2)
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Tags to post',
    default: ['content'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(6)
  @MaxLength(10, { each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Path to photo',
    default: '/uploads/yourphoto.gif|png|jpg',
    type: String,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
