import { computed, inject, Injectable, signal } from '@angular/core';
import { Post, PostStatus } from '../../features/posts/posts.model';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../constants';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

interface PostPayload {
  title: string;
  slug: string;
  contentMarkdown: string;
  excerpt?: string;
  status?: 'draft' | 'published' | 'archived';
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);

  private readonly _posts = signal<Post[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _errorMessage = signal('');

  readonly posts = this._posts.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  loadPosts() {
    this._isLoading.set(true);
    this._errorMessage.set('');

    this.http
      .get<Post[]>(`${API_URL}/admin/posts`)
      .pipe(
        tap((posts) => this._posts.set(posts)),
        catchError(() => {
          this._errorMessage.set('Failed to load posts');
          return EMPTY;
        }),
        finalize(() => this._isLoading.set(false)),
      )
      .subscribe();
  }
  readonly publishedPosts = computed(() =>
    this._posts().filter((post) => post.status === PostStatus.published),
  );

  addPost(data: PostPayload) {
      this._errorMessage.set('');
      return  this.http
      .post<Post>(`${API_URL}/admin/posts`, data)
      .pipe(
        tap((data) => this._posts.update((posts) => [...posts, data])),
        catchError(() => {
          this._errorMessage.set('Failed to load posts');
          return EMPTY;
        }),
      )
  }

updatePost(id: number, data: Partial<PostPayload>) {
  this._errorMessage.set('');

  return this.http.patch<Post>(`${API_URL}/admin/posts/${id}`, data).pipe(
    tap((updatedPost) => {
      this._posts.update((posts) =>
        posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
      );
    }),
    catchError(() => {
      this._errorMessage.set('Failed to update post');
      return EMPTY;
    }),
  );
}
deletePost(id: number) {
  this._errorMessage.set('');

  return this.http.delete<Post>(`${API_URL}/admin/posts/${id}`).pipe(
    tap(() => {
      this._posts.update((posts) => posts.filter((post) => post.id !== id));
    }),
    catchError(() => {
      this._errorMessage.set('Failed to delete post');
      return EMPTY;
    }),
  );
}
}
