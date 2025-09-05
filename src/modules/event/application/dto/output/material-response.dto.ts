import { ApiProperty } from '@nestjs/swagger';

export class MaterialResponseDto {
  @ApiProperty() materialId!: string;
  @ApiProperty({ nullable: true }) materialUrl!: string | null;
  @ApiProperty({ nullable: true }) title!: string | null;
  @ApiProperty({ nullable: true }) description!: string | null;
  @ApiProperty({ nullable: true }) type!: string | null;
  @ApiProperty({ nullable: true }) createAt!: Date | null;
  @ApiProperty() eventId!: string;
}
