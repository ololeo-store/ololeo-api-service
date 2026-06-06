import { Body, Controller, Delete, Param, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoreValuesService } from './store-values.service.js';
import { CreateStoreValueDto, UpdateStoreValueDto } from './dto/store-value.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('Store Values')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('store-values')
export class StoreValuesController {
  constructor(private readonly storeValuesService: StoreValuesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new store value' })
  @ApiResponse({ status: 201, description: 'Store value successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(@Body() createStoreValueDto: CreateStoreValueDto) {
    return this.storeValuesService.create(createStoreValueDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all store values' })
  @ApiResponse({ status: 200, description: 'Return all store values.' })
  async findAll() {
    return this.storeValuesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store value details by ID' })
  @ApiResponse({ status: 200, description: 'Return store value.' })
  @ApiResponse({ status: 404, description: 'Store value not found.' })
  async findOne(@Param('id') id: string) {
    return this.storeValuesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update store value details' })
  @ApiResponse({ status: 200, description: 'Store value successfully updated.' })
  @ApiResponse({ status: 404, description: 'Store value not found.' })
  async update(@Param('id') id: string, @Body() updateStoreValueDto: UpdateStoreValueDto) {
    return this.storeValuesService.update(id, updateStoreValueDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete store value' })
  @ApiResponse({ status: 200, description: 'Store value successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Store value not found.' })
  async remove(@Param('id') id: string) {
    return this.storeValuesService.remove(id);
  }
}
