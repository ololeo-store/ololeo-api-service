import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { ReviewsModule } from './modules/reviews/reviews.module.js';
import { OrderItemsModule } from './modules/order-items/order-items.module.js';
import { GalleryItemsModule } from './modules/gallery-items/gallery-items.module.js';
import { StoreSettingsModule } from './modules/store-settings/store-settings.module.js';
import { StoreValuesModule } from './modules/store-values/store-values.module.js';
import { AiChatSessionsModule } from './modules/ai-chat-sessions/ai-chat-sessions.module.js';
import { AiChatMessagesModule } from './modules/ai-chat-messages/ai-chat-messages.module.js';
import { FinancialTransactionsModule } from './modules/financial-transactions/financial-transactions.module.js';
import { RawMaterialsModule } from './modules/raw-materials/raw-materials.module.js';
import { DiscountsModule } from './modules/discounts/discounts.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoriesModule,
    OrdersModule,
    ProductsModule,
    UsersModule,
    PaymentsModule,
    ReviewsModule,
    OrderItemsModule,
    GalleryItemsModule,
    StoreSettingsModule,
    StoreValuesModule,
    AiChatSessionsModule,
    AiChatMessagesModule,
    FinancialTransactionsModule,
    RawMaterialsModule,
    DiscountsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
