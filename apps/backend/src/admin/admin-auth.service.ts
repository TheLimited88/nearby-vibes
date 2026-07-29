import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TotpService } from './totp.service';
import { AdminLoginDto, AdminVerifyTotpDto } from './dtos/admin-login.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  totp_secret: string;
  totp_enabled: boolean;
  login_attempts: number;
  locked_until: Date | null;
  created_at: Date;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  details: Record<string, any>;
  ip_address: string;
  created_at: Date;
}

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);
  private adminUsers = new Map<string, AdminUser>(); // Mock admin users
  private auditLogs: AuditLog[] = []; // Mock audit log
  private sessionTokens = new Map<string, { adminId: string; expiresAt: Date }>(); // Temp sessions waiting for TOTP

  constructor(
    private readonly jwtService: JwtService,
    private readonly totpService: TotpService,
  ) {}

  // Step 1: Admin login with email + password (generates temporary session)
  async login(loginDto: AdminLoginDto, ipAddress: string) {
    try {
      // Check if admin account exists
      let admin = Array.from(this.adminUsers.values()).find(
        (a) => a.email === loginDto.email,
      );

      if (!admin) {
        throw new UnauthorizedException('Admin account not found');
      }

      // Check if account is locked (after failed TOTP attempts)
      if (admin.locked_until && admin.locked_until > new Date()) {
        const minutesLeft = Math.ceil(
          (admin.locked_until.getTime() - Date.now()) / 60000,
        );
        throw new BadRequestException(
          `Account locked. Try again in ${minutesLeft} minutes.`,
        );
      }

      // Verify password
      const passwordValid = await bcrypt.compare(
        loginDto.password,
        admin.password_hash,
      );

      if (!passwordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Create temporary session token (valid for 15 minutes for TOTP setup)
      const tempToken = uuid();
      this.sessionTokens.set(tempToken, {
        adminId: admin.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      // Log login attempt
      this.auditLogs.push({
        id: uuid(),
        admin_id: admin.id,
        action: 'LOGIN_ATTEMPT',
        details: { success: true, totp_enabled: admin.totp_enabled },
        ip_address: ipAddress,
        created_at: new Date(),
      });

      if (!admin.totp_enabled) {
        return {
          tempToken,
          message: 'Setup 2FA to complete login',
          nextStep: 'setup_2fa',
          needsSetup: true,
        };
      }

      return {
        tempToken,
        message: 'Enter your authenticator code to complete login',
        nextStep: 'verify_totp',
        needsSetup: false,
      };
    } catch (error) {
      this.logger.error('Admin login failed', error);
      throw error;
    }
  }

  // Step 2: Verify TOTP code and issue JWT token
  async verifyTotp(
    tempToken: string,
    verifyTotpDto: AdminVerifyTotpDto,
    ipAddress: string,
  ) {
    try {
      // Validate temp session
      const session = this.sessionTokens.get(tempToken);
      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired. Please login again.');
      }

      const admin = this.adminUsers.get(session.adminId);
      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }

      // Verify TOTP code
      const totpValid = this.totpService.verifyToken(
        admin.totp_secret,
        verifyTotpDto.totpCode,
      );

      if (!totpValid) {
        admin.login_attempts++;
        if (admin.login_attempts >= 3) {
          admin.locked_until = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 mins
          this.auditLogs.push({
            id: uuid(),
            admin_id: admin.id,
            action: 'ACCOUNT_LOCKED',
            details: { reason: 'too_many_failed_totp_attempts' },
            ip_address: ipAddress,
            created_at: new Date(),
          });
        }

        throw new UnauthorizedException('Invalid authenticator code');
      }

      // Reset login attempts on success
      admin.login_attempts = 0;
      admin.locked_until = null;

      // Generate JWT token
      const token = this.jwtService.sign(
        {
          sub: admin.id,
          email: admin.email,
          type: 'admin',
        },
        { expiresIn: '8h' },
      );

      // Clean up temp session
      this.sessionTokens.delete(tempToken);

      // Log successful TOTP verification
      this.auditLogs.push({
        id: uuid(),
        admin_id: admin.id,
        action: 'TOTP_VERIFIED',
        details: { success: true },
        ip_address: ipAddress,
        created_at: new Date(),
      });

      return { token, adminId: admin.id };
    } catch (error) {
      this.logger.error('TOTP verification failed', error);
      throw error;
    }
  }

  // Generate TOTP secret for admin during login flow (requires temp token)
  async generateTotpSecretForSetup(tempToken: string) {
    try {
      const session = this.sessionTokens.get(tempToken);
      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired. Please login again.');
      }

      const admin = this.adminUsers.get(session.adminId);
      if (!admin) {
        throw new BadRequestException('Admin not found');
      }

      // Use existing TOTP secret and generate QR code
      const qrCode = this.totpService.generateQrCodeUrl(
        admin.email,
        admin.totp_secret,
      );

      return {
        secret: admin.totp_secret,
        qrCode,
        message: 'Scan this QR code with your authenticator app',
      };
    } catch (error) {
      this.logger.error('Failed to generate TOTP secret', error);
      throw error;
    }
  }

  // Generate TOTP secret for admin (for MFA setup after login)
  async generateTotpSecret(adminId: string) {
    try {
      const admin = this.adminUsers.get(adminId);
      if (!admin) {
        throw new BadRequestException('Admin not found');
      }

      const { secret, qrCode } = this.totpService.generateSecret(admin.email);

      return {
        secret,
        qrCode,
        message: 'Scan this QR code with your authenticator app',
      };
    } catch (error) {
      this.logger.error('Failed to generate TOTP secret', error);
      throw error;
    }
  }

  // Confirm TOTP setup during login flow (with temp token)
  async confirmTotpSetupWithToken(
    tempToken: string,
    totpCode: string,
    ipAddress: string,
  ) {
    try {
      const session = this.sessionTokens.get(tempToken);
      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired. Please login again.');
      }

      const admin = this.adminUsers.get(session.adminId);
      if (!admin) {
        throw new BadRequestException('Admin not found');
      }

      // Verify the provided code with the generated secret
      const totpValid = this.totpService.verifyToken(
        admin.totp_secret,
        totpCode,
      );

      if (!totpValid) {
        throw new BadRequestException('Invalid code. Please try again.');
      }

      // Enable TOTP for this admin
      admin.totp_enabled = true;

      // Generate JWT token
      const token = this.jwtService.sign(
        {
          sub: admin.id,
          email: admin.email,
          type: 'admin',
        },
        { expiresIn: '8h' },
      );

      // Clean up temp session
      this.sessionTokens.delete(tempToken);

      this.auditLogs.push({
        id: uuid(),
        admin_id: admin.id,
        action: 'TOTP_ENABLED',
        details: { success: true },
        ip_address: ipAddress,
        created_at: new Date(),
      });

      return {
        success: true,
        message: '2FA enabled successfully. You are now logged in.',
        token,
        adminId: admin.id,
      };
    } catch (error) {
      this.logger.error('Failed to confirm TOTP setup', error);
      throw error;
    }
  }

  // Confirm TOTP secret (after admin scans QR code, for logged-in admins)
  async confirmTotpSetup(
    adminId: string,
    totpCode: string,
    ipAddress: string,
  ) {
    try {
      const admin = this.adminUsers.get(adminId);
      if (!admin) {
        throw new BadRequestException('Admin not found');
      }

      // Verify the provided code with the generated secret
      const totpValid = this.totpService.verifyToken(
        admin.totp_secret,
        totpCode,
      );

      if (!totpValid) {
        throw new BadRequestException('Invalid code. Please try again.');
      }

      // Enable TOTP for this admin
      admin.totp_enabled = true;

      this.auditLogs.push({
        id: uuid(),
        admin_id: admin.id,
        action: 'TOTP_ENABLED',
        details: { success: true },
        ip_address: ipAddress,
        created_at: new Date(),
      });

      return { success: true, message: '2FA enabled successfully' };
    } catch (error) {
      this.logger.error('Failed to confirm TOTP setup', error);
      throw error;
    }
  }

  // Create admin user (only for setup by super-admin)
  async createAdminUser(email: string, password: string) {
    try {
      // Check if admin already exists
      const existing = Array.from(this.adminUsers.values()).find(
        (a) => a.email === email,
      );
      if (existing) {
        throw new BadRequestException('Admin with this email already exists');
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Generate initial TOTP secret (will be enabled after admin confirms it)
      const { secret: totp_secret } = this.totpService.generateSecret(email);

      const admin: AdminUser = {
        id: uuid(),
        email,
        password_hash,
        totp_secret,
        totp_enabled: false,
        login_attempts: 0,
        locked_until: null,
        created_at: new Date(),
      };

      this.adminUsers.set(admin.id, admin);

      this.logger.log(`Admin user created: ${admin.id} (${email})`);

      return {
        id: admin.id,
        email: admin.email,
        message: 'Admin user created. Setup 2FA on first login.',
      };
    } catch (error) {
      this.logger.error('Failed to create admin user', error);
      throw error;
    }
  }

  // Get audit logs
  getAuditLogs(adminId?: string, limit: number = 100) {
    let logs = this.auditLogs;

    if (adminId) {
      logs = logs.filter((log) => log.admin_id === adminId);
    }

    return logs.slice(-limit).reverse();
  }

  // Verify admin JWT token
  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
