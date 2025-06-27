import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<string[]>(
        'roles',
        [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();
    console.log('🔒 User:', user);
    console.log('🔒 Required Roles:', requiredRoles);

    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  }

}
