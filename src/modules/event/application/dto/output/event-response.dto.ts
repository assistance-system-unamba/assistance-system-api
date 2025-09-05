import { ApiProperty } from '@nestjs/swagger';
import { MaterialResponseDto } from './material-response.dto';

export class EventResponseDto {
  @ApiProperty() eventId!: string;
  @ApiProperty({ nullable: true }) title!: string | null;
  @ApiProperty({ nullable: true }) description!: string | null;
  @ApiProperty({ nullable: true }) startTime!: Date | null;
  @ApiProperty({ nullable: true }) endTime!: Date | null;
  @ApiProperty({ nullable: true }) place!: string | null;
  @ApiProperty({ nullable: true }) createAt!: Date | null;

  @ApiProperty({ type: [MaterialResponseDto] })
  materials!: MaterialResponseDto[];
}
