import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Crud, CrudController } from '@dataui/crud';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Exam } from '@smart-cloud-apps/common-api-lib';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExamService } from './exam.service';

@Controller('exams')
@UseGuards(JwtAuthGuard)
@Crud({
  model: { type: Exam },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
  params: {
    id: { field: 'examId', type: 'string', primary: true },
  },
  query: {
    alwaysPaginate: true,
    limit: 10,
    maxLimit: 100,
    exclude: ['createdBy', 'updatedBy', 'updatedAt', 'createdAt'],
    sort: [{ field: 'name', order: 'ASC' }],
  },
})
@ApiTags('Exams')
@ApiBearerAuth('access-token')
export class ExamController implements CrudController<Exam> {
  constructor(public service: ExamService) {}
}


