import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OrderItemsService } from './order-items.service.js';
import { OrderItemsController } from './order-items.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [OrderItemsService],
  controllers: [OrderItemsController],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
