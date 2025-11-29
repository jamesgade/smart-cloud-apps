import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import config from '../../../config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ClientService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly entityManager: EntityManager
  ) {}

  async findClientPermissions(studentId: string) {
    const cacheKey = `${studentId}`;
    // If ENABLE_CACHING = true, then get all permissions from cache for userId caching key
    if (config.ENABLE_CACHING) {
      const cachedPermissions = await this.cacheManager.get<any[]>(
        cacheKey
      );
      if (cachedPermissions) {
        return cachedPermissions;
      }
    }
    const query = `
      select p.action as "actionName", r."name" as "roleName"  from student.student s
      join student.student_assign_roles sar on sar.student_id = s.student_id
      join auth.roles r on r.role_id = sar.role_id
      join auth.role_permissions rp on rp.role_id = sar.role_id
      join auth.permissions p on p.permission_id = rp.permission_id
      join auth.permission_objects pb on pb.permission_object_id  = p.object_id 
      where s.student_id = $1
      `;
    const permissionData = await this.entityManager.query(query, [studentId]);
    // If ENABLE_CACHING = true, then cache all permissions for caching key userId
    if (config.ENABLE_CACHING) {
      await this.cacheManager.set(
        cacheKey,
        { data: permissionData },
        config.REDIS_TTL
      );
    }

    return { data: permissionData };
  }

  // async findAllPermissionsOfClient(
  //   clientId: string,
  //   reqUrl: string,
  //   reqMethod: string
  // ): Promise<Permissions[]> {
  //   const result = await this.clientRepository.createQueryBuilder('client')
  //   .innerJoinAndSelect('client.clientAssignRoles', 'clientAssignRoles')
  //   .innerJoinAndSelect('clientAssignRoles.role', 'role')
  //   .innerJoinAndSelect('role.rolePermissions', 'rolePermissions')
  //   .innerJoinAndSelect('rolePermissions.permission', 'permission')
  //   .innerJoinAndSelect('permission.permissionObject', 'object')
  //   .where('client.clientId = :clientId', { clientId: clientId })
  //     .andWhere(
  //       `(CASE WHEN permission.overrideObjectUrl = true THEN permission.path ELSE CONCAT(object.requestUrl, permission.path) END) = :requestUrl`,
  //       {
  //         requestUrl: reqUrl,
  //       }
  //     )
  //     .andWhere('permission.requestMethod = :requestMethod', {
  //       requestMethod: reqMethod,
  //     })
  //     .getOne();

  //   const permissions =
  //     result && result.clientAssignRoles
  //       ? result.clientAssignRoles.flatMap((ua) =>
  //           ua.role.rolePermissions.map((rp) => {
  //             return rp.permission;
  //           })
  //         )
  //       : [];

  //   return permissions;
  // }
}
