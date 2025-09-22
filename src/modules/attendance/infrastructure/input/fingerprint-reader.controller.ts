import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { AttendanceResponseMapper } from '../output/mappers/attendance-response.mapper';
import { FingerprintReaderResponseDto } from '../../application/dto/output/fingerprint-reader-response.dto';

import { CreateFingerprintReaderUseCase } from '../../application/use-cases/fingerprint-reader/create-fingerprint-reader.use-case';
import { GetFingerprintReaderUseCase } from '../../application/use-cases/fingerprint-reader/get-fingerprint-reader.use-case';
import { GetAllFingerprintReadersUseCase } from '../../application/use-cases/fingerprint-reader/get-all-fingerprint-readers.use-case';
import { UpdateFingerprintReaderUseCase } from '../../application/use-cases/fingerprint-reader/update-fingerprint-reader.use-case';
import { DeleteFingerprintReaderUseCase } from '../../application/use-cases/fingerprint-reader/delete-fingerprint-reader.use-case';

import { CreateFingerprintReaderDto } from '../../application/dto/input/fingerprint-reader/create-fingerprint-reader.dto';
import { UpdateFingerprintReaderDto } from '../../application/dto/input/fingerprint-reader/update-fingerprint-reader.dto';

@Controller('fingerprint-readers')
export class FingerprintReaderController {
  constructor(
    private readonly createUC: CreateFingerprintReaderUseCase,
    private readonly getUC: GetFingerprintReaderUseCase,
    private readonly getAllUC: GetAllFingerprintReadersUseCase,
    private readonly updateUC: UpdateFingerprintReaderUseCase,
    private readonly deleteUC: DeleteFingerprintReaderUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateFingerprintReaderDto): Promise<FingerprintReaderResponseDto> {
    const reader = await this.createUC.execute(
      {
        ip: dto.ip ?? null,
        deviceSeries: dto.deviceSeries ?? null,
        name: dto.name ?? null,
        port: dto.port ?? null,
        location: dto.location ?? null,
      },
      (dto.attendanceLogs ?? []).map((l) => ({
        timestamp: l.timestamp ? new Date(l.timestamp) : new Date(),
        status: l.status ?? 'PRESENT',
        participantId: l.participantId ?? '',
      })),
    );
    return AttendanceResponseMapper.toReaderDto(reader);
  }

  @Get()
  async findAll(): Promise<FingerprintReaderResponseDto[]> {
    const readers = await this.getAllUC.execute();
    return readers.map((r) => AttendanceResponseMapper.toReaderDto(r));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FingerprintReaderResponseDto> {
    const reader = await this.getUC.execute(id);
    return AttendanceResponseMapper.toReaderDto(reader);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFingerprintReaderDto): Promise<FingerprintReaderResponseDto> {
    const updated = await this.updateUC.execute(id, {
      ip: dto.ip ?? undefined,
      deviceSeries: dto.deviceSeries ?? undefined,
      name: dto.name ?? undefined,
      port: dto.port ?? undefined,
      location: dto.location ?? undefined,
    });
    return AttendanceResponseMapper.toReaderDto(updated);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.deleteUC.execute(id);
    return { __message: 'FingerprintReader eliminado' };
  }
}
