import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { JwtAuthGuard } from '../auth/jwt.auth.guard.js';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '../common/parse-positive-int.pipe.js';
import { ParseNonNegativeIntPipe } from '../common/parse-non-negative-int.pipe.js';

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create comment to post' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/comments')
  async create(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentsService.create(
      postId,
      req.user.id,
      createCommentDto,
    );
  }

  @ApiOperation({ summary: 'Get all comments of the post' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @Get('posts/:postId/comments')
  async findAll(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Query('skip', new DefaultValuePipe(0), ParseNonNegativeIntPipe)
    skip: number,
    @Query('take', new DefaultValuePipe(5), ParseNonNegativeIntPipe)
    take: number,
  ) {
    return await this.commentsService.findAll(postId, skip, Math.min(take, 20));
  }

  @ApiOperation({ summary: 'Get the comment of post' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @Get('posts/:postId/comments/:id')
  async findOne(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('id', ParsePositiveIntPipe) id: number,
  ) {
    return await this.commentsService.findOne(postId, id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update comment to the post' })
  @ApiForbiddenResponse({ description: 'You are not the comment author' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @UseGuards(JwtAuthGuard)
  @Patch('posts/:postId/comments/:id')
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Request() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentsService.update(id, req.user.id, updateCommentDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment' })
  @ApiForbiddenResponse({
    description: 'You are not the comment author or post author',
  })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @UseGuards(JwtAuthGuard)
  @Delete('posts/:postId/comments/:id')
  async remove(@Param('id', ParsePositiveIntPipe) id: number, @Request() req) {
    return await this.commentsService.remove(id, req.user.id);
  }
}
