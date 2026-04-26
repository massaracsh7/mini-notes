import { Component, computed, inject } from '@angular/core';
import { PostsService } from './posts-service';
import { DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-posts',
  imports: [DatePipe, CardModule, TagModule, ButtonModule, RouterLink],
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
})
export class Posts {
  public postsService = inject(PostsService);

  postsList = this.postsService.posts;
  featuredPost = computed(() => this.postsList()[0] ?? null);
  restPosts = computed(() => this.postsList().slice(1));

  getSummary(excerpt: string | null, contentMarkdown: string) {
    if (excerpt?.trim()) {
      return excerpt;
    }

    const plainText = contentMarkdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[.*?\]\(.*?\)/g, ' ')
      .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1')
      .replace(/[#>*_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return plainText.length > 180 ? `${plainText.slice(0, 180).trim()}...` : plainText;
  }
}