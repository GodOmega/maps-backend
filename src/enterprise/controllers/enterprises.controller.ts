import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Delete,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';

import {
  CreateEnterpriseDto,
  UpdateEnterpriseDto,
  FilterEnterpriseDto,
  RemoveEmployee
} from '../dtos/enterprise.dto';

import { EnterpriseService } from '../services/enterprise.service';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enterprises')
export class EnterprisesController {
  constructor(private enterpriseService: EnterpriseService) {}

  @Roles(Role.ADMIN)
  @Get()
  getAll(@Query() params: FilterEnterpriseDto) {
    return this.enterpriseService.findAll(params);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get(':id')
  getEnterprise(@Param('id', ParseIntPipe) enterpriseId: number) {
    return this.enterpriseService.findOne(enterpriseId);
  }

  @Roles(Role.ADMIN)
  @Post()
  createEnterprise(@Body() payload: CreateEnterpriseDto) {
    return this.enterpriseService.create(payload);
  }


  @Roles(Role.ADMIN, Role.OWNER)
  @Put(':id')
  changeEnterprise(
    @Param('id', ParseIntPipe) enterpriseId: number,
    @Body() payload: UpdateEnterpriseDto,
  ) {
    return this.enterpriseService.update(enterpriseId, payload);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Put('/remove/employee')
  removeEmployee(@Body() payload: RemoveEmployee) {
    return this.enterpriseService.removeEmployee(payload);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteEnterprise(@Param('id', ParseIntPipe) enterpriseId: number) {
    return this.enterpriseService.delete(enterpriseId);
  }
}
