import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { LogVisitDto } from './dto/analytics.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async logVisit(dto: LogVisitDto, ipAddress?: string, userAgent?: string) {
    return this.prisma.visitor_logs.create({
      data: {
        id: randomUUID(),
        path: dto.path,
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
      },
    });
  }

  async getDashboardStats() {
    // 1. Total Metrics
    const totalPageviews = await this.prisma.visitor_logs.count();
    
    // Distinct ip count
    const uniqueVisitorsResult = await this.prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(DISTINCT ip_address) as count FROM visitor_logs
    `;
    const uniqueVisitors = Number(uniqueVisitorsResult[0]?.count || 0);

    // Total sales revenue from successful payments
    const totalRevenueResult = await this.prisma.payments.aggregate({
      where: { status: 'success' },
      _sum: { amount: true },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    // Total orders count
    const totalOrders = await this.prisma.orders.count();

    // Conversion rate (orders / unique visitors)
    const conversionRate = uniqueVisitors > 0 
      ? Math.round((totalOrders / uniqueVisitors) * 10000) / 100 // format as percentage with 2 decimals
      : 0;

    // 2. Weekly Visitor History (Past 7 Days)
    const visitorHistory: { date: string; pageviews: number; visitors: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);

      const pageviews = await this.prisma.visitor_logs.count({
        where: {
          created_at: {
            gte: d,
            lt: nextDay,
          },
        },
      });

      const visitorsRaw = await this.prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(DISTINCT ip_address) as count FROM visitor_logs
        WHERE created_at >= ${d} AND created_at < ${nextDay}
      `;
      const visitors = Number(visitorsRaw[0]?.count || 0);

      visitorHistory.push({
        date: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
        pageviews,
        visitors,
      });
    }

    // 3. Weekly Sales History (Past 7 Days)
    const salesHistory: { date: string; revenue: number; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);

      const paymentsDay = await this.prisma.payments.aggregate({
        where: {
          status: 'success',
          created_at: {
            gte: d,
            lt: nextDay,
          },
        },
        _sum: { amount: true },
        _count: { id: true },
      });

      salesHistory.push({
        date: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
        revenue: paymentsDay._sum.amount || 0,
        count: paymentsDay._count.id || 0,
      });
    }

    // 4. Top Selling Products
    // Aggregate order quantities from order_items
    const topProductsRaw = await this.prisma.order_items.groupBy({
      by: ['product_id'],
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: 'desc' },
      },
      take: 5,
    });

    const topProducts = await Promise.all(
      topProductsRaw.map(async (item) => {
        const prod = await this.prisma.products.findUnique({
          where: { id: item.product_id },
          select: { name: true },
        });
        return {
          name: prod?.name || 'Produk Terhapus',
          quantity: item._sum.quantity || 0,
        };
      })
    );

    // 5. Popular Paths / Views
    const pathStats = await this.prisma.visitor_logs.groupBy({
      by: ['path'],
      _count: { id: true },
      orderBy: {
        _count: { id: 'desc' },
      },
      take: 5,
    });

    const pagePaths = pathStats.map((item) => ({
      path: item.path,
      count: item._count.id,
    }));

    return {
      total_pageviews: totalPageviews,
      unique_visitors: uniqueVisitors,
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      conversion_rate: conversionRate,
      visitor_history: visitorHistory,
      sales_history: salesHistory,
      top_products: topProducts,
      page_paths: pagePaths,
    };
  }
}
