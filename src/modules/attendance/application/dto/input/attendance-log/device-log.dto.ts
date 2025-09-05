import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class DeviceLogDto {
  @IsNotEmpty()
  @IsString()
  deviceUserId: string;

  @IsNotEmpty()
  @IsDateString()
  recordTime: string;

  @IsNotEmpty()
  @IsString()
  ip: string;
}
