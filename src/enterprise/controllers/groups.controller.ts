import { Controller, Get, Post, Body } from '@nestjs/common';

import { GroupsService } from '../services/groups.service'

@Controller('groups')
export class GroupsController {
    constructor(private groupService: GroupsService){}

    @Post()
    createGroup(@Body() payload: any) {
        return this.groupService.create(payload)
    }
}
