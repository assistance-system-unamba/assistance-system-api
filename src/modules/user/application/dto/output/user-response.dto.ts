import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'miqueas123' })
  userName: string;

  @ApiProperty({ example: 1 })
  role: number|null;

  @ApiProperty({ example: '12345678', required: false })
  cardNumber?: string|null;

  @ApiProperty({ example: 'djfsadflsaldfj', required: false })
  participantId!: string;
}
