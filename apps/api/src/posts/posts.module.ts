import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AdminPostsController } from './admin-post.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController, AdminPostsController],
  providers: [PostsService],
})
export class PostsModule {}
