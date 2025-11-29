import { Injectable } from '@nestjs/common';
import { PermissionCondition } from './permission-condition.interfact';

@Injectable()
export class PermissionConditionService {
  public static parseCondition(
    condition: PermissionCondition | null,
    variables: Record<string, any>
  ): PermissionCondition | null {
    if (!condition) return null;
    const parsedCondition: {[key: string]: any} = {};
    for (const [key, rawValue] of Object.entries(condition)) {
      if (rawValue !== null && typeof rawValue === 'object') {
        const value = this.parseCondition(rawValue, variables);
        parsedCondition[key] = value;
        continue;
      }
      if (typeof rawValue !== 'string') {
        parsedCondition[key] = rawValue;
        continue;
      }
      // find placeholder "${}""
      const matches = /^\\${([a-zA-Z0-9]+)}$/.exec(rawValue);
      if (!matches) {
        parsedCondition[key] = rawValue;
        continue;
      }
      const value = variables[matches[1]];
      if (typeof value === 'undefined') {
        throw new ReferenceError(`Variable ${name} is not defined`);
      }
      parsedCondition[key] = value;
    }
    return parsedCondition;
  }
}
