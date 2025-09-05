import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { CreateParticipantDto } from "../participant/create-participant.dto";
import { CreatePersonalDataDto } from "../personal-data/create-personal-data.dto";

export class CreateUserDto {
  @ApiPropertyOptional({ example: 2, description: 'Rol (1=ADMIN, 2=USER). Opcional.' })
  @IsInt() 
  role!: number;

  @ApiProperty({ example: 'alex.lancho', description: 'Nombre de usuario único' })
  @IsNotEmpty() @IsString() 
  userName!: string;

  @ApiProperty({ example: 'NewPassword123', minLength: 6, description: 'Contraseña (mínimo 6 caracteres)' })
  @IsNotEmpty() @IsString() @MinLength(6) 
  password!: string;

  @ApiPropertyOptional({ example: '12345678', description: 'Número de tarjeta (8–20 dígitos). Opcional.' })
  @IsOptional() @IsString() 
  cardNumber?: string;

  @ApiProperty({ type: CreatePersonalDataDto, description: 'Datos personales a crear' })
  @ValidateNested() @Type(() => CreatePersonalDataDto)
  personalData!: CreatePersonalDataDto;

  @ApiProperty({ type: CreateParticipantDto, description: 'Datos de participante a crear' })
  @ValidateNested() @Type(() => CreateParticipantDto)
  participant!: CreateParticipantDto;
}