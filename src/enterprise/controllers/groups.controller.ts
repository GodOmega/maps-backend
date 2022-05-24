import { Controller, Get, Post, Body ,Put, Param, ParseIntPipe } from '@nestjs/common';

import { GroupsService } from '../services/groups.service'
import { CreateEnterpriseGroupDto, UpdateEnterpriseGroup } from '../dtos/enterpriseGroup.dto';

@Controller('groups')
export class GroupsController {
    constructor(private groupService: GroupsService){}

    @Post()
    createGroup(@Body() payload: CreateEnterpriseGroupDto) {
        return this.groupService.create(payload)
    }

    @Get(':id')
    getGroup(@Param('id', ParseIntPipe) groupId: number) {
      console.log(groupId);
      return this.groupService.getGroup(groupId);
    }
  
    @Put(':id')
    updateGroup(
      @Param('id', ParseIntPipe) groupId: number,
      @Body() payload: UpdateEnterpriseGroup,
    ) {
      return this.groupService.updateGroup(groupId, payload);
    }
}
