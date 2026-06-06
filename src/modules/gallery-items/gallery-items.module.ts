import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { GalleryItemsService } from './gallery-items.service.js';
import { GalleryItemsController } from './gallery-items.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [GalleryItemsService],
  controllers: [GalleryItemsController],
  exports: [GalleryItemsService],
})
export class GalleryItemsModule {}
