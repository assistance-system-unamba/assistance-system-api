import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty() userId!: number;
  @ApiProperty({ nullable: true }) userName!: string | null;
  @ApiProperty({ nullable: true }) role!: number | null;
  @ApiProperty({ nullable: true }) participantId!: string | null;
}
