import { inject, Injectable } from '@angular/core';
import { Post } from './posts.model';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../constants';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  http = inject(HttpClient);
  posts = toSignal(this.http.get<Post[]>(`${API_URL}/posts`), { initialValue: [] });

  getPostBySlug(slug: string) {
    return this.http.get<Post>(`${API_URL}/posts/${slug}`);
  }
}
