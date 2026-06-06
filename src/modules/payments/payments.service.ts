import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    // 1. Verify order exists
    const order = await this.prisma.orders.findUnique({
      where: { id: dto.order_id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID '${dto.order_id}' not found`);
    }

    // 2. Verify transaction_id uniqueness
    const existingPayment = await this.prisma.payments.findUnique({
      where: { transaction_id: dto.transaction_id },
    });

    if (existingPayment) {
      throw new ConflictException(`Payment with transaction ID '${dto.transaction_id}' already exists`);
    }

    // 3. Create payment and update order status inside a transaction
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payments.create({
        data: {
          id: randomUUID(),
          order_id: dto.order_id,
          transaction_id: dto.transaction_id,
          status: dto.status,
          amount: dto.amount,
          payment_type: dto.payment_type,
          raw_payload: dto.raw_payload,
          updated_at: new Date(),
        },
      });

      // Update order payment status based on payment status
      let orderPaymentStatus = 'unpaid';
      if (dto.status.toLowerCase() === 'success' || dto.status.toLowerCase() === 'settlement') {
        orderPaymentStatus = 'paid';
      } else if (dto.status.toLowerCase() === 'failed' || dto.status.toLowerCase() === 'expire') {
        orderPaymentStatus = 'failed';
      }

      await tx.orders.update({
        where: { id: dto.order_id },
        data: {
          payment_status: orderPaymentStatus,
          updated_at: new Date(),
        },
      });

      return payment;
    });
  }

  async findAll() {
    return this.prisma.payments.findMany({
      include: {
        orders: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payments.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID '${id}' not found`);
    }

    return payment;
  }

  async update(id: string, dto: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payments.update({
        where: { id },
        data: {
          status: dto.status ?? payment.status,
          amount: dto.amount ?? payment.amount,
          payment_type: dto.payment_type ?? payment.payment_type,
          raw_payload: dto.raw_payload ?? payment.raw_payload,
          updated_at: new Date(),
        },
      });

      // If status is updated, update the associated order's payment status
      if (dto.status && dto.status !== payment.status) {
        let orderPaymentStatus = 'unpaid';
        if (dto.status.toLowerCase() === 'success' || dto.status.toLowerCase() === 'settlement') {
          orderPaymentStatus = 'paid';
        } else if (dto.status.toLowerCase() === 'failed' || dto.status.toLowerCase() === 'expire') {
          orderPaymentStatus = 'failed';
        }

        await tx.orders.update({
          where: { id: payment.order_id },
          data: {
            payment_status: orderPaymentStatus,
            updated_at: new Date(),
          },
        });
      }

      return updatedPayment;
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.payments.delete({
      where: { id },
    });
  }
}
