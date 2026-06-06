import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFinancialTransactionDto, UpdateFinancialTransactionDto } from './dto/financial-transaction.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class FinancialTransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFinancialTransactionDto) {
    return this.prisma.financial_transactions.create({
      data: {
        id: randomUUID(),
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        category: dto.category,
        date: dto.date ? new Date(dto.date) : new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(filters?: { type?: string; category?: string; startDate?: string; endDate?: string }) {
    const where: any = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    return this.prisma.financial_transactions.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const transaction = await this.prisma.financial_transactions.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID '${id}' not found`);
    }

    return transaction;
  }

  async update(id: string, dto: UpdateFinancialTransactionDto) {
    const transaction = await this.findOne(id);

    return this.prisma.financial_transactions.update({
      where: { id },
      data: {
        type: dto.type ?? transaction.type,
        amount: dto.amount ?? transaction.amount,
        description: dto.description !== undefined ? dto.description : transaction.description,
        category: dto.category ?? transaction.category,
        date: dto.date ? new Date(dto.date) : transaction.date,
        updated_at: new Date(),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.financial_transactions.delete({
      where: { id },
    });
  }

  async getSummary() {
    const transactions = await this.prisma.financial_transactions.findMany();
    
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else if (t.type === 'expense') {
        totalExpense += t.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }
}
