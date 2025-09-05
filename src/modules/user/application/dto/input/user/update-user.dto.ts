import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 1, description: 'Nuevo rol (1=ADMIN, 2=USER). Opcional.' })
  @IsOptional() @IsInt() role?: number;

  @ApiPropertyOptional({ example: 'nuevoUser123', description: 'Nuevo nombre de usuario' })
  @IsOptional() @IsString() userName?: string;

  @ApiPropertyOptional({ example: 'NewPassword123', minLength: 6, description: 'Nueva contraseña' })
  @IsOptional() @IsString() @MinLength(6) password?: string;

  @ApiPropertyOptional({ example: '123456789012', description: 'Nuevo número de tarjeta (8–20 dígitos)' })
  @IsOptional() @IsString() cardNumber?: string;
}
