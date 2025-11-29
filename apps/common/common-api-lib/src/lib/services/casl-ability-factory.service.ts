import { Injectable } from '@nestjs/common';
import { Ability } from '@casl/ability';
import {
  PermissionActions,
  PermissionCondition,
} from './permission-condition.interfact';
import { PermissionConditionService } from './permission-condition.service';

export type PermissionObjectType = any;
export type AppAbility = Ability<[string, PermissionObjectType]>;

interface CaslPermission {  
  action: string;
  subject: string;
  condition?: PermissionCondition | null;
}
@Injectable()
export class CaslAbilityFactory {
  async createForUser(
    actions: PermissionActions[],
    user: any,
    permissions: any[]
  ): Promise<AppAbility> {
    const caslPermissions: CaslPermission[] = permissions.map((p) => {
      const mappedAction = actions.find(
        (action) => action.action === p.action
      );
      return {        
        action: mappedAction?.action || '',
        subject: p.permissionObject.name,
        condition: PermissionConditionService.parseCondition(p.condition, user),
      };
    });
    
    return new Ability<[string, PermissionObjectType]>(caslPermissions);
  }
}
