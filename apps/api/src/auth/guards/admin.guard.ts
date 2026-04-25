import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  user?: {
    role?: string;
  };
};

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('No user');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('Admins only');
    }

    return true;
  }
}
