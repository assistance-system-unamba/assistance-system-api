import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'alex' })
  @IsString() userName!: string;

  @ApiProperty({ example: 'alex12345' })
  @IsString() @MinLength(6) password!: string;
}