import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMaterialInlineDto } from './create-material-inline.dto';

export class CreateManyMaterialsDto {
  @ApiProperty({ example: '4e62b7f5-fb4a-4a6f-8e63-0a30a3c6a2e9' })
  @IsString() @IsNotEmpty()
  eventId!: string;

  @ApiProperty({
    type: [CreateMaterialInlineDto],
    example: [
      { materialUrl: 'https://example.com/a.pdf', title: 'A', type: 'PDF' },
      { materialUrl: 'https://example.com/b.zip', title: 'B', type: 'ZIP' }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMaterialInlineDto)
  materials!: CreateMaterialInlineDto[];
}
