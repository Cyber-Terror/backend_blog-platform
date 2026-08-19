import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreatePostDto) {
    const tags = (dto.tags ?? []).map((name) => name.toLowerCase());
    return await this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId: userId,
        imageUrl: dto.imageUrl,
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
  }

  async findAll(authorId?: number, tag?: string) {
    return await this.prisma.post.findMany({
      where: {
        ...(authorId ? { authorId } : {}),
        ...(tag ? { tags: { some: { name: tag } } } : {}),
      },
      include: {
        author: {
          select: {
            login: true,
          },
        },
        tags: true,
      },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Пост не найден');
    }
    return await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            login: true,
          },
        },
        tags: true,
      },
    });
  }

  async update(id: number, userId: number, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    if (post?.authorId !== userId) {
      throw new ForbiddenException('Вы не автор этого поста');
    }
    const { tags, ...data } = dto;
    const normalizedTags = tags?.map((name) => name.toLowerCase());
    return await this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        ...(normalizedTags
          ? {
              tags: {
                set: [], // сбросить текущие теги поста
                connectOrCreate: normalizedTags.map((name) => ({
                  where: { name },
                  create: { name },
                })),
              },
            }
          : {}),
      },
    });
  }

  async remove(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (post?.authorId !== userId) {
      throw new ForbiddenException('Вы не автор этого поста');
    }
    return await this.prisma.post.delete({ where: { id } });
  }
}
