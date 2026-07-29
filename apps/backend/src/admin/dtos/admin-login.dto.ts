import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class AdminLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class AdminVerifyTotpDto {
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  totpCode: string;
}
