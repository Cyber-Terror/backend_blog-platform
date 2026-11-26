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
    const tags = Array.from(
      new Set(
        (dto.tags ?? [])
          .map((name) => name.trim().toLowerCase())
          .filter(Boolean),
      ),
    );
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
    const posts = await this.prisma.post.findMany({
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return posts.map(({ _count, ...post }) => ({
      ...post,
      commentsCount: _count.comments,
    }));
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            login: true,
          },
        },
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const { _count, ...data } = post;
    return { ...data, commentsCount: _count.comments };
  }

  async update(id: number, userId: number, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post?.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }
    const { tags, ...data } = dto;
    const normalizedTags = tags
      ? Array.from(
          new Set(tags.map((n) => n.trim().toLowerCase()).filter(Boolean)),
        )
      : undefined;
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
      throw new ForbiddenException('You are not the author of this post');
    }
    return await this.prisma.post.delete({ where: { id } });
  }
}
