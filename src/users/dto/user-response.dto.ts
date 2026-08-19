import { IsDate, IsEmail } from 'class-validator';

export class UserResponseDto {
  id: number;
  @IsEmail()
  email: string;
  @IsDate()
  createdAt: Date;
}
