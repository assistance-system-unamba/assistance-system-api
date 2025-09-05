import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAttendanceInlineDto } from './create-attendance-inline.dto';

export class CreateManyAttendanceLogsDto {
  @ApiProperty({ example: 'fpr1' })
  @IsString() @Length(1, 36)
  fingerprintReaderId!: string;

  @ApiProperty({
    type: [CreateAttendanceInlineDto],
    example: [
      { timestamp: '2025-09-01T09:05:00.000Z', status: 'PRESENT', participantId: 'par1' },
      { timestamp: '2025-09-05T14:05:00.000Z', status: 'PRESENT', participantId: 'par2' }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceInlineDto)
  logs!: CreateAttendanceInlineDto[];
}
