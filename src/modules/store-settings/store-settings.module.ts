import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { StoreSettingsService } from './store-settings.service.js';
import { StoreSettingsController } from './store-settings.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [StoreSettingsService],
  controllers: [StoreSettingsController],
  exports: [StoreSettingsService],
})
export class StoreSettingsModule {}
