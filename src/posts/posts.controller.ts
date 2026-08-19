import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { JwtAuthGuard } from '../auth/jwt.auth.guard.js';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../common/response.dto.js';
import { ParsePositiveIntPipe } from '../common/parse-positive-int.pipe.js';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create post' })
  @ApiOkResponse({ description: 'Create Single post', type: ApiResponseDto })
  @ApiUnauthorizedResponse({ description: 'No token' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return await this.postsService.create(req.user.id, createPostDto);
  }

  @ApiOperation({ summary: 'Get posts | Get posts of the author' })
  @ApiOkResponse({ description: 'List of posts', type: ApiResponseDto })
  @Get()
  async findAll(
    @Query('authorId', ParsePositiveIntPipe) authorId?: number,
    @Query('tag') tag?: string,
  ) {
    return await this.postsService.findAll(authorId, tag);
  }

  @ApiOperation({ summary: 'Get the post' })
  @ApiOkResponse({ description: 'Get single post', type: ApiResponseDto })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @Get(':id')
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the post' })
  @ApiOkResponse({ description: 'Updated post', type: ApiResponseDto })
  @ApiUnauthorizedResponse({ description: 'No token' })
  @ApiForbiddenResponse({ description: 'You are not the author' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Request() req,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.update(id, req.user.id, updatePostDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete the post' })
  @ApiOkResponse({ description: 'Deleted post', type: ApiResponseDto })
  @ApiUnauthorizedResponse({ description: 'No token' })
  @ApiForbiddenResponse({ description: 'You are not the author' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParsePositiveIntPipe) id: number, @Request() req) {
    return await this.postsService.remove(id, req.user.id);
  }
}
