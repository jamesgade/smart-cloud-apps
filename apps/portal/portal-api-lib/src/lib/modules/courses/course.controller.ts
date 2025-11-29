import { Controller, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Crud, CrudController } from '@dataui/crud';
import { Course } from '@smart-cloud-apps/common-api-lib';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('course')
@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Course,
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
  params: {
    id: {
      field: 'courseId',
      type: 'string',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    exclude: ['createdBy', 'updatedBy', 'updatedAt', 'createdAt'],
    sort: [
      {
        field: 'name',
        order: 'ASC',
      },
    ],
  },
})
@ApiTags('Courses')
// @UsePipes(new ValidationPipe())
@ApiBearerAuth('access-token')
@Controller('courses')
export class CourseController {
  constructor(private readonly service: CourseService) {}
}