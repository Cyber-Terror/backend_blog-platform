import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Your login',
    default: 'your_login',
    type: String,
  })
  @IsString()
  login: string;

  @ApiProperty({
    description: 'Your login',
    default: 'your_password',
    type: String,
  })
  @IsString()
  password: string;
}
