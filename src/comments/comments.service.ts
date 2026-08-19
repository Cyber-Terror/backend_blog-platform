import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    postId: number,
    userId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Пост не найден');
    }
    return await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        authorId: userId,
        postId,
      },
      include: {
        author: {
          select: {
            login: true,
          },
        },
      },
    });
  }

  async findAll(postId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    return await this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        author: {
          select: {
            login: true,
          },
        },
      },
    });
  }

  async findOne(postId: number, id: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    return await this.prisma.comment.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            login: true,
          },
        },
      },
    });
  }

  async update(id: number, userId: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id: id } });

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment?.authorId !== userId) {
      throw new ForbiddenException('Вы не автор этого комментария');
    }
    return await this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        author: {
          select: {
            login: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id: id } });
    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment?.authorId !== userId) {
      throw new ForbiddenException('Вы не автор этого комментария');
    }
    return await this.prisma.comment.delete({ where: { id } });
  }
}
