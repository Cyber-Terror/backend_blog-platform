import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/jwt.auth.guard.js';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '../common/parse-positive-int.pipe.js';

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @ApiOperation({ summary: 'Get users' })
  @Get()
  async getUsers() {
    return await this.usersService.findAll();
  }
  @ApiOperation({ summary: 'Get user' })
  @Get(':userId')
  async getUser(@Param('userId', ParsePositiveIntPipe) userId: number) {
    return await this.usersService.findOneById(userId);
  }

  @ApiOperation({ summary: 'Update user' })
  @Patch(':userId')
  async updateUser(
    @Param('userId', ParsePositiveIntPipe) userId: number,
    @Body() updateDto: UpdateUserDto,
  ) {
    // return await this.usersService.update(+userId, updateDto);
  }

  // @ApiOperation({ summary: 'Delete user' })
  // @Delete(':userId')
  // async deleteUser(
  //   @Param('userId', ParsePositiveIntPipe) userId: number,
  //   @Request() req,
  // ) {
  //   if (userId !== req.user.id) {
  //     throw new ForbiddenException('Можно удалять только свой аккаунт');
  //   }
  //   return await this.usersService.delete(userId);
  // }
}
