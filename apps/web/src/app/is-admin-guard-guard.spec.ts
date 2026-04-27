import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { isAdminGuard } from './is-admin-guard-guard';

describe('isAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            createUrlTree: vi.fn((commands: string[]) => commands.join('/')),
          },
        },
      ],
    });
    localStorage.clear();
  });

  it('should allow admin users', () => {
    localStorage.setItem('role', 'admin');

    expect(executeGuard({} as never, {} as never)).toBe(true);
  });

  it('should redirect non-admin users to login', () => {
    expect(executeGuard({} as never, {} as never)).toBe('/login');
  });
});
