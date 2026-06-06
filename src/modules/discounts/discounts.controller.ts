import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { DiscountsService } from './discounts.service.js';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto.js';

@ApiTags('Discounts')
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly service: DiscountsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new discount rule' })
  create(@Body() dto: CreateDiscountDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discount rules' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discount rule by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update discount rule' })
  update(@Param('id') id: string, @Body() dto: UpdateDiscountDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete discount rule' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
