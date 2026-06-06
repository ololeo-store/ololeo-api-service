import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { FinancialTransactionsService } from './financial-transactions.service.js';
import { CreateFinancialTransactionDto, UpdateFinancialTransactionDto } from './dto/financial-transaction.dto.js';

@ApiTags('Financial Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('financial-transactions')
export class FinancialTransactionsController {
  constructor(private readonly service: FinancialTransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new financial transaction' })
  create(@Body() dto: CreateFinancialTransactionDto) {
    return this.service.create(dto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get total income, expense, and balance summary' })
  getSummary() {
    return this.service.getSummary();
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all financial transactions' })
  @ApiQuery({ name: 'type', required: false, enum: ['income', 'expense'] })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findAll(
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.findAll({ type, category, startDate, endDate });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction details by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction details' })
  update(@Param('id') id: string, @Body() dto: UpdateFinancialTransactionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a financial transaction' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
