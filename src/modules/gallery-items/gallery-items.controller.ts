import { Body, Controller, Delete, Param, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GalleryItemsService } from './gallery-items.service.js';
import { CreateGalleryItemDto, UpdateGalleryItemDto } from './dto/gallery-item.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('Gallery Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gallery-items')
export class GalleryItemsController {
  constructor(private readonly galleryItemsService: GalleryItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gallery item' })
  @ApiResponse({ status: 201, description: 'Gallery item successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async create(@Body() createGalleryItemDto: CreateGalleryItemDto) {
    return this.galleryItemsService.create(createGalleryItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gallery items' })
  @ApiResponse({ status: 200, description: 'Return all gallery items.' })
  async findAll() {
    return this.galleryItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gallery item by ID' })
  @ApiResponse({ status: 200, description: 'Return gallery item details.' })
  @ApiResponse({ status: 404, description: 'Gallery item not found.' })
  async findOne(@Param('id') id: string) {
    return this.galleryItemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gallery item details' })
  @ApiResponse({ status: 200, description: 'Gallery item successfully updated.' })
  @ApiResponse({ status: 404, description: 'Gallery item or Product not found.' })
  async update(@Param('id') id: string, @Body() updateGalleryItemDto: UpdateGalleryItemDto) {
    return this.galleryItemsService.update(id, updateGalleryItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete gallery item' })
  @ApiResponse({ status: 200, description: 'Gallery item successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Gallery item not found.' })
  async remove(@Param('id') id: string) {
    return this.galleryItemsService.remove(id);
  }
}
