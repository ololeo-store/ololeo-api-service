import { Body, Controller, Delete, Param, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoreSettingsService } from './store-settings.service.js';
import { CreateStoreSettingDto, UpdateStoreSettingDto } from './dto/store-setting.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('Store Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('store-settings')
export class StoreSettingsController {
  constructor(private readonly storeSettingsService: StoreSettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new store setting' })
  @ApiResponse({ status: 201, description: 'Store setting successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 409, description: 'Store setting key already exists.' })
  async create(@Body() createStoreSettingDto: CreateStoreSettingDto) {
    return this.storeSettingsService.create(createStoreSettingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all store settings' })
  @ApiResponse({ status: 200, description: 'Return all store settings.' })
  async findAll() {
    return this.storeSettingsService.findAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get store setting by key' })
  @ApiResponse({ status: 200, description: 'Return store setting details.' })
  @ApiResponse({ status: 404, description: 'Store setting not found.' })
  async findOne(@Param('key') key: string) {
    return this.storeSettingsService.findOne(key);
  }

  @Patch(':key')
  @ApiOperation({ summary: 'Update store setting value' })
  @ApiResponse({ status: 200, description: 'Store setting successfully updated.' })
  @ApiResponse({ status: 404, description: 'Store setting not found.' })
  async update(@Param('key') key: string, @Body() updateStoreSettingDto: UpdateStoreSettingDto) {
    return this.storeSettingsService.update(key, updateStoreSettingDto);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete store setting' })
  @ApiResponse({ status: 200, description: 'Store setting successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Store setting not found.' })
  async remove(@Param('key') key: string) {
    return this.storeSettingsService.remove(key);
  }
}
