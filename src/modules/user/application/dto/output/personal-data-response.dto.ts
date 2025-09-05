import { ApiProperty } from '@nestjs/swagger';

export class PersonalDataResponseDto {
  @ApiProperty({ example: 'e0a4c7c1-2fd7-4f81-a7f1-2e90e3e2b820', description: 'ID de datos personales (UUID v4)' })
  personalDataId!: string;

  @ApiProperty({ example: 'Alex', nullable: true, description: 'Nombre(s) (puede ser null)' })
  name!: string | null;

  @ApiProperty({ example: 'Lancho Ramos', nullable: true, description: 'Apellidos (puede ser null)' })
  lastName!: string | null;

  @ApiProperty({ example: '87654321', nullable: true, description: 'DNI (puede ser null)' })
  dni!: string | null;

  @ApiProperty({ example: '1998-05-15', nullable: true, description: 'Fecha de nacimiento (Date) o null' })
  dateBirth!: Date;

  @ApiProperty({ example: 'alex@example.com', nullable: true, description: 'Correo electrónico (puede ser null)' })
  email!: string | null;

  @ApiProperty({ example: '999888777', nullable: true, description: 'Celular (puede ser null)' })
  cellPhone!: string | null;
}
