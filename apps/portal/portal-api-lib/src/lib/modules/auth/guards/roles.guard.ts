import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { StudentService } from '../student/student.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
    private readonly studentService: StudentService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const { username, userTypeName } = user;

    // Check if user has the required role/user type
    if (userTypeName === 'Student') {
      // For students, check if 'Student' is in required roles
      if (!requiredRoles.includes('Student')) {
        throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
      }
      
      // Verify student exists in database
      const student = await this.studentService.studentDataWithEmail(username);
      if (!student) {
        throw new ForbiddenException('Student not found');
      }
    } else {
      // For regular users, check against admin roles
      const adminRoles = ['Admin', 'Super Admin', 'Staff'];
      const hasAdminRole = requiredRoles.some(role => adminRoles.includes(role));
      
      if (!hasAdminRole) {
        throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
      }
      
      // Verify user exists in database
      const dbUser = await this.userService.findByEmailData(username);
      if (!dbUser) {
        throw new ForbiddenException('User not found');
      }
    }

    return true;
  }
}