import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LookupsDataProcess {
  constructor(private readonly configService: ConfigService) {}

  async filterFindMap(
    originalArr: any[],
    idPropName: string,
    userId: string
  ): Promise<any[]> {
    const mappedObjects = originalArr.map((id: any) => ({
      [idPropName]: id,
      createdBy: userId,
      updatedBy: userId,
    }));
    return mappedObjects;
  }

  async filterFindUpdate(
    originalArr: any[],
    newArr: any[],
    idPropName: string,
    userId: string
  ): Promise<any[]> {
    const filtered = originalArr.filter((obj) =>
      newArr.includes(obj[idPropName])
    );
    const missing = newArr.filter(
      (id) => !originalArr.find((obj) => obj[idPropName] === id)
    );

    const mappedMissing = missing.map((id: any) => ({
      [idPropName]: id,
      createdBy: userId,
      updatedBy: userId,
    }));
    return [...filtered, ...mappedMissing].map((obj) => ({ ...obj }));
  }

  async filterFindUpdateOrgId(
    originalArr: any[],
    newArr: any[],
    idPropName: string,
    userId: string,
    organizationId: string
  ): Promise<any[]> {
    const filtered = originalArr.filter((obj) =>
      newArr.includes(obj[idPropName])
    );
    const missing = newArr.filter(
      (id) => !originalArr.find((obj) => obj[idPropName] === id)
    );

    const mappedMissing = missing.map((id: any) => ({
      [idPropName]: id,
      organizationId: organizationId,
      createdBy: userId,
      updatedBy: userId,
    }));
    return [...filtered, ...mappedMissing].map((obj) => ({ ...obj }));
  }

  async getIdFromName(entityName: string, name: string, repository: any) {
    if (!name) return null;

    const entity = await repository
      .createQueryBuilder(entityName)
      .select(`${entityName}.id`)
      .where(`LOWER(TRIM(${entityName}.name)) = :name`, {
        name: name.toLowerCase().trim(),
      })
      .getOne();

    return entity?.id;
  }
}
