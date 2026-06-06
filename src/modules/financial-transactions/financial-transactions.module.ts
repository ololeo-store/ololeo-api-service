import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { FinancialTransactionsService } from './financial-transactions.service.js';
import { FinancialTransactionsController } from './financial-transactions.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [FinancialTransactionsService],
  controllers: [FinancialTransactionsController],
  exports: [FinancialTransactionsService],
})
export class FinancialTransactionsModule {}
