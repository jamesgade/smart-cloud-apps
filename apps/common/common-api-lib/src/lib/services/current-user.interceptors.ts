import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  portalAppUsers,
  studentAppUsers,
} from '../constants/user-type-logins.constants';

@Injectable()
export class CurrentUserMapInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const requestMethod = req.method;
    const userId = req.user?.userId;
    const now = new Date().toISOString();
    const sitePath = req.headers['sitepath']?.toLowerCase();

    const isPortalUser = (userTypeId: string) =>
      Object.values(portalAppUsers.userTypes).includes(userTypeId);

    const isStudentUser = (userTypeId: string) =>
      Object.values(studentAppUsers.userTypes).includes(userTypeId);

    const validateUserByUserTypeId = (userTypeId: string, path: string) => {
      if (
        path &&
        Object.values(portalAppUsers.appPaths).includes(path) &&
        isPortalUser(userTypeId)
      ) {
        return true;
      }

      if (
        path &&
        Object.values(studentAppUsers.appPaths).includes(path) &&
        isStudentUser(userTypeId)
      ) {
        return true;
      }

      throw new HttpException(
        `Access Denied. You are not authorized to access this site path.`,
        HttpStatus.FORBIDDEN,
      );
    };

    if (sitePath) {
      validateUserByUserTypeId(req.user?.userTypeId, sitePath);
    }

    req.body.updatedBy = userId;

    if (requestMethod === 'POST') {
      req.body.createdBy = userId;
    } else {
      req.body.updatedAt = now;
    }

    const updateNestedEntities = (data: any) => {
      if (!data || typeof data !== 'object' || data === null) {
        return;
      }
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value instanceof Array) {
          value.forEach((item) => {
            if (item && typeof item === 'object') {
              if (requestMethod === 'POST') {
                item.createdBy = userId;
                item.updatedBy = userId;
              } else {
                item.createdBy = userId;
                item.updatedBy = userId;
                item.updatedAt = now;
              }
              updateNestedEntities(item);
            }
          });
        } else if (value && typeof value === 'object') {
          if (requestMethod === 'POST') {
            value.createdBy = userId;
            value.updatedBy = userId;
          } else {
            value.createdBy = userId;
            value.updatedBy = userId;
            value.updatedAt = now;
          }
          updateNestedEntities(value);
        } else if (typeof value === 'string') {
          data[key] = value.trim();
        }
      });
    };
    updateNestedEntities(req.body);

    return next.handle();
  }
}
