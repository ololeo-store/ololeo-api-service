import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AnalyticsService } from './analytics.service.js';
import { LogVisitDto } from './dto/analytics.dto.js';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Post('log-visit')
  @ApiOperation({ summary: 'Log a website page visit/hit' })
  logVisit(@Body() dto: LogVisitDto, @Req() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'] as string || '';
    const userAgent = req.headers['user-agent'] || '';
    return this.service.logVisit(dto, ip, userAgent);
  }

  @Get('dashboard')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get aggregated analytics for the admin dashboard' })
  getDashboardStats() {
    return this.service.getDashboardStats();
  }
}
