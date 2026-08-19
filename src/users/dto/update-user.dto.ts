import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: ' Enter your new login',
    default: 'new_login',
    type: String,
  })
  @IsString()
  login?: string;

  @ApiProperty({
    description: ' Enter your new password',
    default: 'new_password',
    type: String,
  })
  @IsString()
  password?: string;
}
