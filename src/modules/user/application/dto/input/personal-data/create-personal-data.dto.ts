import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePersonalDataDto {
  @ApiPropertyOptional({ example: 'Natalie', description: 'Nombre(s)' })
  @IsString() 
  name: string;

  @ApiPropertyOptional({ example: 'Cruz Tumba', description: 'Apellidos' })
  @IsString() 
  lastName: string;

  @ApiPropertyOptional({ example: '74156122', description: 'DNI (8 dígitos)' })
  @IsString() @MinLength(8) 
  dni: string;

  @ApiPropertyOptional({ example: '2002-12-25', description: 'Fecha de nacimiento (YYYY-MM-DD)' })  
  @IsDateString()
  dateBirth: Date;

  @ApiPropertyOptional({ example: '201059@unamba.edu.pe', description: 'Correo electrónico' })
  @IsString() 
  email: string;

  @ApiPropertyOptional({ example: '958837579', description: 'Celular' })
  @IsOptional() @IsString() 
  cellPhone?: string;
}
