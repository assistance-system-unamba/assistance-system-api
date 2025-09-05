import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateMaterialDto {
  @ApiPropertyOptional({ example: 'https://example.com/new.pdf' })
  @IsOptional() @IsUrl()
  materialUrl?: string;

  @ApiPropertyOptional({ example: 'Nuevo título', maxLength: 100 })
  @IsOptional() @IsString() @Length(1, 100)
  title?: string;

  @ApiPropertyOptional({ example: 'Descripción actualizada' })
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'VIDEO', maxLength: 45 })
  @IsOptional() @IsString() @Length(1, 45)
  type?: string;
}
