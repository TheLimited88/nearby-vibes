import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UseGuards,
  Req,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto, AdminVerifyTotpDto } from './dtos/admin-login.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('api/admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  // POST /api/admin/login — Step 1: Email + Password
  // Returns temp token for TOTP verification
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: AdminLoginDto,
    @Headers('x-forwarded-for') forwarded?: string,
    @Req() req?: any,
  ) {
    const ipAddress = forwarded || req?.ip || '0.0.0.0';
    return this.adminAuthService.login(loginDto, ipAddress);
  }

  // POST /api/admin/login/verify-totp — Verify TOTP (for enabled 2FA)
  @Post('login/verify-totp')
  @HttpCode(200)
  async verifyTotp(
    @Body() body: { tempToken: string; totpCode: string },
    @Headers('x-forwarded-for') forwarded?: string,
    @Req() req?: any,
  ) {
    if (!body.tempToken || !body.totpCode) {
      throw new BadRequestException('Temp token and TOTP code are required');
    }
    const ipAddress = forwarded || req?.ip || '0.0.0.0';
    const verifyTotpDto: AdminVerifyTotpDto = { totpCode: body.totpCode };
    return this.adminAuthService.verifyTotp(body.tempToken, verifyTotpDto, ipAddress);
  }

  // POST /api/admin/2fa/setup — Generate TOTP secret (requires temp token from login)
  @Post('2fa/setup')
  @HttpCode(200)
  async generateTotpSecret(@Body() body: { tempToken: string }) {
    if (!body.tempToken) {
      throw new BadRequestException('Temp token is required');
    }
    return this.adminAuthService.generateTotpSecretForSetup(body.tempToken);
  }

  // POST /api/admin/2fa/confirm — Confirm TOTP setup (requires temp token + TOTP code)
  @Post('2fa/confirm')
  @HttpCode(200)
  async confirmTotpSetup(
    @Body() body: { tempToken: string; totpCode: string },
    @Headers('x-forwarded-for') forwarded?: string,
    @Req() req?: any,
  ) {
    if (!body.tempToken || !body.totpCode) {
      throw new BadRequestException('Temp token and TOTP code are required');
    }
    const ipAddress = forwarded || req?.ip || '0.0.0.0';
    return this.adminAuthService.confirmTotpSetupWithToken(
      body.tempToken,
      body.totpCode,
      ipAddress,
    );
  }

  // GET /api/admin/audit-logs — Retrieve audit logs
  @Get('audit-logs')
  @UseGuards(JwtAuthGuard)
  getAuditLogs(
    @Req() req: any,
  ) {
    return {
      logs: this.adminAuthService.getAuditLogs(req.user.sub, 100),
    };
  }

  // POST /api/admin/bootstrap — Create first admin user (bootstrap only)
  @Post('bootstrap')
  @HttpCode(201)
  async bootstrap(
    @Body() body: { email: string; password: string },
  ) {
    return this.adminAuthService.createAdminUser(body.email, body.password);
  }

  // GET /api/admin/health — Health check (requires valid JWT)
  @Get('health')
  @UseGuards(JwtAuthGuard)
  adminHealth(@Req() req: any) {
    return {
      status: 'ok',
      admin_id: req.user.sub,
      timestamp: new Date().toISOString(),
    };
  }
}
