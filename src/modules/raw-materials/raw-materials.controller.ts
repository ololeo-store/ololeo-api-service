import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RawMaterialsService } from './raw-materials.service.js';
import { CreateRawMaterialDto, UpdateRawMaterialDto } from './dto/raw-material.dto.js';

@ApiTags('Raw Materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('raw-materials')
export class RawMaterialsController {
  constructor(private readonly service: RawMaterialsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new raw material item' })
  create(@Body() dto: CreateRawMaterialDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all raw materials' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get raw material details by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update raw material details' })
  update(@Param('id') id: string, @Body() dto: UpdateRawMaterialDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a raw material item' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
