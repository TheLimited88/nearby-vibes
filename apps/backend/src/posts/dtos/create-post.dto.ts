import { IsString, IsUUID, IsDateString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreatePostDto {
  @IsUUID()
  venue_id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsDateString()
  expires_at: string;

  @IsOptional()
  @IsNumber()
  discount_percent?: number;

  @IsOptional()
  @IsNumber()
  discount_cap?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  tags?: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsDateString()
  expires_at?: string;

  @IsOptional()
  @IsNumber()
  discount_percent?: number;

  @IsOptional()
  @IsNumber()
  discount_cap?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsEnum(['draft', 'published', 'expired', 'cancelled'])
  status?: 'draft' | 'published' | 'expired' | 'cancelled';
}
