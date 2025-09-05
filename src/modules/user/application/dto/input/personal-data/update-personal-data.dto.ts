import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePersonalDataDto {
  @ApiPropertyOptional({ example: 'Alex', description: 'Nombre(s)' })
  @IsOptional() @IsString() 
  name?: string;

  @ApiPropertyOptional({ example: 'Lancho Ramos', description: 'Apellidos' })
  @IsOptional() @IsString() 
  lastName?: string;

  @ApiPropertyOptional({ example: '87654321', description: 'DNI (8 dígitos)' })
  @IsOptional() @IsString() @MinLength(8) 
  dni?: string;

  @ApiPropertyOptional({ example: '1998-05-15', description: 'Fecha de nacimiento (YYYY-MM-DD)' })
  @IsDateString()
  dateBirth: Date;

  @ApiPropertyOptional({ example: 'alex@example.com', description: 'Correo electrónico' })
  @IsOptional() @IsString() 
  email?: string;

  @ApiPropertyOptional({ example: '999888777', description: 'Celular' })
  @IsOptional() @IsString() 
  cellPhone?: string;
}
