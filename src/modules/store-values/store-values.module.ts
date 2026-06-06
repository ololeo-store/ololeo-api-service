import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { StoreValuesService } from './store-values.service.js';
import { StoreValuesController } from './store-values.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [StoreValuesService],
  controllers: [StoreValuesController],
  exports: [StoreValuesService],
})
export class StoreValuesModule {}
