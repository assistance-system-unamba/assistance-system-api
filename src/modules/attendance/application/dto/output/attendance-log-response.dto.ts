import { ApiProperty } from '@nestjs/swagger';

export class AttendanceLogResponseDto {
  @ApiProperty() logId!: string;
  @ApiProperty({ nullable: true }) timestamp!: Date | null;
  @ApiProperty({ nullable: true }) status!: string | null;
  @ApiProperty({ nullable: true }) createAt!: Date | null;
  @ApiProperty() fingerprintReaderId!: string;
  @ApiProperty() participantId!: string;
}
