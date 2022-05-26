import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { GroupsService } from '../services/groups.service';
import {
  CreateEnterpriseGroupDto,
  UpdateEnterpriseGroup,
  AddEmployeeDto,
} from '../dtos/enterpriseGroup.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('groups')
export class GroupsController {
  constructor(private groupService: GroupsService) {}

  @Get(':id/employees')
  getEmployees(@Param('id', ParseIntPipe) groupId: number) {
    return this.groupService.getGroupEmployees(groupId);
  }

  @Post()
  createGroup(@Body() payload: CreateEnterpriseGroupDto) {
    return this.groupService.create(payload);
  }

  @Post('/employee')
  addEmployee(@Body() payload: AddEmployeeDto) {
    return this.groupService.addEmployee(payload);
  }

  @Get(':id')
  getGroup(@Param('id', ParseIntPipe) groupId: number) {
    return this.groupService.getGroup(groupId);
  }

  @Put(':id')
  updateGroup(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() payload: UpdateEnterpriseGroup,
  ) {
    return this.groupService.updateGroup(groupId, payload);
  }

  @Delete(':id')
  deleteGroup(@Param('id', ParseIntPipe) groupId: number) {
    return this.groupService.delete(groupId);
  }
}
