import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'Get tags' })
  @Get()
  async getTags() {
    return await this.tagsService.findAll();
  }
}
