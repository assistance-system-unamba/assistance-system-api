import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMaterialInlineDto } from '../material/create-material-inline.dto';

export class CreateEventDto {
  @ApiPropertyOptional({ example: 'Congreso de Tecnología', maxLength: 100 })
  @IsOptional() @IsString() @Length(1, 100)
  title?: string;

  @ApiPropertyOptional({ example: 'Evento académico sobre IA y Big Data' })
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2025-09-01T09:00:00.000Z', description: 'ISO8601' })
  @IsOptional() @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ example: '2025-09-01T18:00:00.000Z', description: 'ISO8601' })
  @IsOptional() @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ example: 'Auditorio UNAMBA', maxLength: 60 })
  @IsOptional() @IsString() @Length(1, 60)
  place?: string;

  @ApiPropertyOptional({ example: 'https://example.com/slides.pd', description:"Url del imagen del evento"})
  @IsOptional() 
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Materiales del evento (opcional)',
    required: false,
    type: [CreateMaterialInlineDto],
    example: [
      { materialUrl: 'https://example.com/slides.pdf', title: 'Slides', description: 'Presentación', type: 'PDF' }
    ]
  })
  @IsOptional() @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMaterialInlineDto)
  materials?: CreateMaterialInlineDto[];
}
