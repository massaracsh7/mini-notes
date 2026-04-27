import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'prisma/prisma.service';
import { PostStatus, Prisma } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    try {
      return await this.prisma.post.create({
        data: { ...createPostDto, createdAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
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
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async findPublishedBySlug(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        status: PostStatus.published,
      },
    });

    if (!post) {
      throw new NotFoundException(
        `Published post with slug "${slug}" not found`,
      );
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.ensureExists(id);
    try {
      return await this.prisma.post.update({
        where: { id },
        data: {
          ...updatePostDto,
          publishedAt: this.resolvePublishedAt(updatePostDto),
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: number) {
    await this.ensureExists(id);

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

  private async ensureExists(id: number) {
    const count = await this.prisma.post.count({
      where: { id },
    });

    if (!count) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Post with this slug already exists');
    }

    throw error;
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
