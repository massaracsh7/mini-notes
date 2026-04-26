import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { PostsService } from '../../features/posts/posts-service';
import { renderMarkdown } from '../../shared/markdown';

@Component({
  selector: 'app-post-page',
  imports: [DatePipe, RouterLink, CardModule, TagModule, ButtonModule],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class PostPage {
  private route = inject(ActivatedRoute);
  private postsService = inject(PostsService);

  slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')), {
    initialValue: '',
  });

  post = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
      switchMap((slug) => this.postsService.getPostBySlug(slug).pipe(catchError(() => of(null)))),
    ),
    { initialValue: null },
  );

  markdownContent = computed(() => {
    const post = this.post();
    return post ? renderMarkdown(post.contentMarkdown) : '';
  });
}
