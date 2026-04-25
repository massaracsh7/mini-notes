import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'prisma/prisma.service';
import { PostStatus } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    return await this.prisma.post.create({
      data: { ...createPostDto, createdAt: new Date()}
    });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  findPublished() {
    return this.prisma.post.findMany({
      where: { status: PostStatus.published },
    });
  }

  async findOne(id: number) {
    return await this.prisma.post.findUnique({
      where: { id },
    });
  }

  async findPublishedBySlug(slug: string) {
    return await this.prisma.post.findUnique({
      where: { slug },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.prisma.post.update({
      where: { id },
      data: {... updatePostDto, publishedAt: this.resolvePublishedAt(updatePostDto)}
    });
  }

  async delete(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

    private resolvePublishedAt(dto: CreatePostDto | UpdatePostDto) {
    if (dto.status === PostStatus.published) {
      return new Date();
    }

    if (dto.status === PostStatus.draft) {
      return null;
    }

    if (dto.status === PostStatus.archived) {
      return null;
    }

    return undefined;
  }
}



// create(dto)
// findAll() для админки
// findPublished() для публичной части
// findOne(id)
// findPublishedBySlug(slug)
// update(id, dto)
// delete(id)
// Логика:

// при published ставить publishedAt = new Date()
// при draft и archived сбрасывать publishedAt
