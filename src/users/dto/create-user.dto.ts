import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Your email',
    default: 'your_email@gmail.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Your login (minimal length is 6)',
    default: 'superlogin',
    type: String,
  })
  @IsString()
  @MinLength(6)
  login: string;

  @ApiProperty({
    description: 'Your password (minimal length is 6)',
    default: 'createYourOwnPassword',
    type: String,
  })
  @MaxLength(72)
  @IsString()
  @MinLength(6)
  password: string;
}
