import { Body, Controller, Delete, Param, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderItemsService } from './order-items.service.js';
import { CreateOrderItemDto, UpdateOrderItemDto } from './dto/order-item.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('Order Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({ status: 201, description: 'Order item successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Order or Product not found.' })
  async create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order items' })
  @ApiResponse({ status: 200, description: 'Return all order items.' })
  async findAll() {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order item by ID' })
  @ApiResponse({ status: 200, description: 'Return order item details.' })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  async findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order item details' })
  @ApiResponse({ status: 200, description: 'Order item successfully updated.' })
  @ApiResponse({ status: 404, description: 'Order item, Order, or Product not found.' })
  async update(@Param('id') id: string, @Body() updateOrderItemDto: UpdateOrderItemDto) {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order item' })
  @ApiResponse({ status: 200, description: 'Order item successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  async remove(@Param('id') id: string) {
    return this.orderItemsService.remove(id);
  }
}
