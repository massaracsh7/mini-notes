import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { AdminService } from '../admin-service';
import { Post, PostStatus } from '../../../features/posts/posts.model';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';

interface PostFormValue {
  title: string;
  slug: string;
  contentMarkdown: string;
  excerpt: string;
  status: PostStatus;
}

@Component({
  selector: 'app-admin-form',
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MessageModule,
  ],
  templateUrl: './admin-form.html',
  styleUrl: './admin-form.scss',
})
export class AdminForm {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);

  readonly post = input<Post | null>(null);
  readonly saved = output<void>();
  readonly canceled = output<void>();

  readonly isSaving = signal(false);
  readonly errorMessage = signal('');

  readonly statuses = Object.values(PostStatus).map((status) => ({
    label: status[0].toUpperCase() + status.slice(1),
    value: status,
  }));

  readonly formPost = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    contentMarkdown: ['', [Validators.required]],
    excerpt: [''],
    status: [PostStatus.draft, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const post = this.post();

      if (post) {
        this.formPost.setValue({
          title: post.title,
          slug: post.slug,
          contentMarkdown: post.contentMarkdown,
          excerpt: post.excerpt ?? '',
          status: post.status,
        });

        this.clearFormErrors();
        return;
      }

      this.resetForm();
    });
  }

  get isEditMode() {
    return this.post() !== null;
  }

  hasFieldError(fieldName: keyof PostFormValue, errorCode = 'required') {
    const control = this.formPost.controls[fieldName];
    return control.touched && control.hasError(errorCode);
  }

  submit() {
    if (this.formPost.invalid) {
      this.formPost.markAllAsTouched();
      return;
    }

    const currentPost = this.post();
    const payload = this.buildPayload(this.formPost.getRawValue());

    const operation = currentPost
      ? this.adminService.updatePost(currentPost.id, payload)
      : this.adminService.addPost(payload);

    this.isSaving.set(true);
    this.clearFormErrors();

    operation
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.resetForm();
          this.saved.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage.set(this.resolveErrorMessage(err));
        },
      });
  }

  cancelEdit() {
    this.clearFormErrors();
    this.resetForm();
    this.canceled.emit();
  }

  private resetForm() {
    this.formPost.reset({
      title: '',
      slug: '',
      contentMarkdown: '',
      excerpt: '',
      status: PostStatus.draft,
    });

    this.formPost.markAsPristine();
    this.formPost.markAsUntouched();
    this.clearFormErrors();
  }

  private buildPayload(formValue: PostFormValue) {
    return {
      ...formValue,
      excerpt: formValue.excerpt.trim() ? formValue.excerpt.trim() : undefined,
    };
  }

  private resolveErrorMessage(err: HttpErrorResponse) {
    if (err.status === 409) {
      this.formPost.controls.slug.setErrors({
        ...this.formPost.controls.slug.errors,
        serverConflict: true,
      });
      this.formPost.controls.slug.markAsTouched();
      return 'Slug already exists. Use a unique address for this post.';
    }

    if (err.status === 400) {
      this.formPost.markAllAsTouched();
      return 'Please check the form fields and try again.';
    }

    return 'Failed to save post. Please try again.';
  }

  private clearFormErrors() {
    this.errorMessage.set('');

    const slugControl = this.formPost.controls.slug;

    if (slugControl.hasError('serverConflict')) {
      const { serverConflict, ...rest } = slugControl.errors ?? {};
      slugControl.setErrors(Object.keys(rest).length ? rest : null);
    }
  }
}