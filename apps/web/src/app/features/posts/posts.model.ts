export enum PostStatus {
  draft = 'draft',
  published = 'published',
  archived = 'archived',
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  contentMarkdown: string;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
