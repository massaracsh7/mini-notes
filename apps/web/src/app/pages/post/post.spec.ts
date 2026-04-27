import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PostPage } from './post';
import { PostsService } from '../../features/posts/posts-service';

describe('PostPage', () => {
  let component: PostPage;
  let fixture: ComponentFixture<PostPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ slug: 'example-post' })),
          },
        },
        {
          provide: PostsService,
          useValue: {
            getPostBySlug: vi.fn(() =>
              of({
                id: 1,
                title: 'Example post',
                slug: 'example-post',
                excerpt: null,
                contentMarkdown: '# Hello',
                status: 'published',
                publishedAt: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }),
            ),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
