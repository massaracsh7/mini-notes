import { HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => storage.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        storage.delete(key);
      }),
      clear: vi.fn(() => {
        storage.clear();
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should pass through the request when token is missing', () => {
    const request = new HttpRequest('GET', '/posts');
    const next = vi.fn((req: HttpRequest<unknown>) => of(new HttpResponse({ body: req })));

    authInterceptor(request, next).subscribe();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].headers.has('Authorization')).toBe(false);
  });

  it('should attach bearer token when token exists', () => {
    localStorage.setItem('token', 'test-token');

    const request = new HttpRequest('GET', '/admin/posts');
    const next = vi.fn((req: HttpRequest<unknown>) => of(new HttpResponse({ body: req })));

    authInterceptor(request, next).subscribe();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].headers.get('Authorization')).toBe('Bearer test-token');
  });
});
