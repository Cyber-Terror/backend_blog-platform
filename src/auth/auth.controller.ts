import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { LocalAuthGuard } from './local.auth.guard.js';
import { JwtAuthGuard } from './jwt.auth.guard.js';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../users/dto/login-user.dto.js';
import { seconds, Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @ApiOperation({ summary: 'Create an account' })
  @ApiCreatedResponse({ description: 'User created without password' })
  @ApiConflictResponse({ description: 'Email or login already exists' })
  @Throttle({ default: { limit: 3, ttl: seconds(60) } })
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check profile' })
  @ApiOkResponse({ description: 'Current user' })
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@Request() req) {
    return req?.user;
  }

  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Log in' })
  @ApiOkResponse({ description: 'Returns access_token' })
  @ApiUnauthorizedResponse({ description: 'Wrong login or password' })
  @Throttle({ default: { limit: 3, ttl: seconds(60) } })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
}
