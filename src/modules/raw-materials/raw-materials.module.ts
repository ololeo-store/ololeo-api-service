import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RawMaterialsService } from './raw-materials.service.js';
import { RawMaterialsController } from './raw-materials.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [RawMaterialsService],
  controllers: [RawMaterialsController],
  exports: [RawMaterialsService],
})
export class RawMaterialsModule {}
