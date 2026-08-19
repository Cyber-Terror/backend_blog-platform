import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { LoginDto } from '../users/dto/login-user.dto.js';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existingEmail = await this.usersService.findOneByLogin(dto.email);
    const existingLogin = await this.usersService.findOneByLogin(dto.login);
    if (existingEmail) {
      throw new ConflictException('По такой почте уже существует пользователь');
    }
    if (existingLogin) {
      throw new ConflictException(
        'По такому логину  уже существует пользователь',
      );
    }

    const hashPassword = await bcrypt.hash(dto.password, 10);

    return await this.usersService.create({
      email: dto.email,
      login: dto.login,
      password: hashPassword,
    });
  }

  async login(user: {
    id: number;
    login: string;
  }): Promise<{ access_token: string }> {
    const payload = { sub: user.id, login: user.login };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findOneByLogin(loginDto.login);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
