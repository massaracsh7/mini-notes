import { Component, inject, signal } from '@angular/core';
import { Post, PostStatus } from '../../features/posts/posts.model';
import { finalize } from 'rxjs';
import { AdminService } from './admin-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { AdminForm } from './admin-form/admin-form';

@Component({
  selector: 'app-admin',
  imports: [AdminForm,
    DatePipe,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    MessageModule,
    ProgressSpinnerModule,
    SelectModule,],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  readonly adminService = inject(AdminService);

  readonly selectedPost = signal<Post | null>(null);
  readonly isDeletingId = signal<number | null>(null);
  readonly isUpdatingStatusId = signal<number | null>(null);

  readonly statusOptions = Object.values(PostStatus).map((status) => ({
    label: status[0].toUpperCase() + status.slice(1),
    value: status,
  }));

  ngOnInit() {
    this.adminService.loadPosts();
  }

  startEdit(post: Post) {
    this.selectedPost.set(post);
  }

  cancelEdit() {
    this.selectedPost.set(null);
  }

  handleSaved() {
    this.selectedPost.set(null);
    this.adminService.loadPosts();
  }

  deletePost(post: Post) {
    this.isDeletingId.set(post.id);

    this.adminService
      .deletePost(post.id)
      .pipe(finalize(() => this.isDeletingId.set(null)))
      .subscribe(() => {
        if (this.selectedPost()?.id === post.id) {
          this.selectedPost.set(null);
        }
      });
  }

  updateStatus(post: Post, status: PostStatus) {
    if (post.status === status) {
      return;
    }

    this.isUpdatingStatusId.set(post.id);

    this.adminService
      .updatePost(post.id, { status })
      .pipe(finalize(() => this.isUpdatingStatusId.set(null)))
      .subscribe((updatedPost) => {
        if (this.selectedPost()?.id === updatedPost.id) {
          this.selectedPost.set(updatedPost);
        }
      });
  }

  getSeverity(status: Post['status']) {
    switch (status) {
      case 'published':
        return 'success';
      case 'archived':
        return 'contrast';
      default:
        return 'warn';
    }
  }
}
