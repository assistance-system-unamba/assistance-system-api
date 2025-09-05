import { ApiProperty } from '@nestjs/swagger';
import { AttendanceLogResponseDto } from './attendance-log-response.dto';

export class FingerprintReaderResponseDto {
  @ApiProperty() fingerprintReaderId!: string;
  @ApiProperty({ nullable: true }) ip!: string | null;
  @ApiProperty({ nullable: true }) deviceSeries!: string | null;
  @ApiProperty({ nullable: true }) name!: string | null;
  @ApiProperty({ nullable: true }) port!: string | null;
  @ApiProperty({ nullable: true }) location!: string | null;

  @ApiProperty({ type: [AttendanceLogResponseDto] })
  attendanceLogs!: AttendanceLogResponseDto[];
}
