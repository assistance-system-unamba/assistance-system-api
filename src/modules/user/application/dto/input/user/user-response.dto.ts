import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador numérico del usuario (autoincremental)' })
  userId!: number;

  @ApiProperty({ example: 2, nullable: true, description: 'Rol del usuario: por ejemplo 1=ADMIN, 2=USER. Puede ser null.' })
  role!: number | null;

  @ApiProperty({ example: 'alex.lancho', description: 'Nombre de usuario único' })
  userName!: string;

  @ApiProperty({ example: '12345678', nullable: true, description: 'Número de tarjeta del usuario (8–20 dígitos). Puede ser null.' })
  cardNumber!: string | null;

  @ApiProperty({ example: '2f1e6f36-4a2f-4a7a-9b83-8d7f3646c8a1', description: 'ID del participante asociado (UUID v4)' })
  participantId!: string;
}
