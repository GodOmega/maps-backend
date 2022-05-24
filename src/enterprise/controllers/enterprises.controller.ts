import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';

import {
  CreateEnterpriseDto,
  UpdateEnterpriseDto,
} from '../dtos/enterprise.dto';
import { EnterpriseService } from '../services/enterprise.service';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enterprises')
export class EnterprisesController {
  constructor(private enterpriseService: EnterpriseService) {}

  // @Roles(Role.ADMIN)
  // @Public()
  @Get(':id')
  getEnterprise(@Param('id', ParseIntPipe) enterpriseId: number) {
    return this.enterpriseService.findOne(enterpriseId);
  }

  // @Public()
  @Post()
  createEnterprise(@Body() payload: CreateEnterpriseDto) {
    return this.enterpriseService.create(payload);
  }

  @Put(':id')
  changeEnterprise(
    @Param('id', ParseIntPipe) enterpriseId: number,
    @Body() payload: UpdateEnterpriseDto,
  ) {
    return this.enterpriseService.update(enterpriseId, payload);
  }
}
