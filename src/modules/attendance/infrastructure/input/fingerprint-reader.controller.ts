import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Sse } from '@nestjs/common';
import { Observable, interval, map, switchMap, startWith } from 'rxjs';
import { CreateFingerprintReaderUseCase } from '../../application/use-cases/fingerprint-reader/create-fingerprint-reader.use-case';
import { GetFingerprintReaderUseCase } from '../../application/use-cases/fingerprint-reader/get-fingerprint-reader.use-case';
import { GetAllFingerprintReadersUseCase } from '../../application/use-cases/fingerprint-reader/get-all-fingerprint-readers.use-case';
import { UpdateFingerprintReaderUseCase } from '../../application/use-cases/fingerprint-reader/update-fingerprint-reader.use-case';
import { DeleteFingerprintReaderUseCase } from '../../application/use-cases/fingerprint-reader/delete-fingerprint-reader.use-case';
import { AttendanceResponseMapper } from '../output/mappers/attendance-response.mapper';
import { FingerprintReaderResponseDto } from '../../application/dto/output/fingerprint-reader-response.dto';
import { MessageEvent } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../domain/repositories/attendance.repository';
import { Inject } from '@nestjs/common';
import { CreateFingerprintReaderDto } from '../../application/dto/input/fingerprint-reader/create-fingerprint-reader.dto';

@Controller('fingerprint-readers')
export class FingerprintReaderController {
  constructor(
    private readonly createUC: CreateFingerprintReaderUseCase,
    private readonly getUC: GetFingerprintReaderUseCase,
    private readonly getAllUC: GetAllFingerprintReadersUseCase,
    private readonly updateUC: UpdateFingerprintReaderUseCase,
    private readonly deleteUC: DeleteFingerprintReaderUseCase,
    @Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository,
  ) {}

  /** Crear lector con 0..n logs opcionales */
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

  /** Listar lectores */
  @Get()
  async findAll(): Promise<FingerprintReaderResponseDto[]> {
    const readers = await this.getAllUC.execute();
    return readers.map((r) => AttendanceResponseMapper.toReaderDto(r));
  }

  /** Obtener lector por id */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FingerprintReaderResponseDto> {
    const reader = await this.getUC.execute(id);
    return AttendanceResponseMapper.toReaderDto(reader);
  }

  /** Actualizar lector */
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any): Promise<FingerprintReaderResponseDto> {
    const updated = await this.updateUC.execute(id, {
      ip: dto.ip ?? undefined,
      deviceSeries: dto.deviceSeries ?? undefined,
      name: dto.name ?? undefined,
      port: dto.port ?? undefined,
      location: dto.location ?? undefined,
    });
    return AttendanceResponseMapper.toReaderDto(updated);
  }

  /** Eliminar lector (borra logs primero) */
  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.deleteUC.execute(id);
    return { __message: 'FingerprintReader eliminado' };
  }

  /**
   * Stream SSE de attendance logs en "tiempo real".
   * Usa polling cada 2s y devuelve SOLO nuevos logs desde "since" (query) o desde ahora.
   * GET /fingerprint-readers/:id/stream?since=2025-09-01T00:00:00.000Z&pollMs=2000
   */
  @Sse(':fingerprintReaderId/stream')
  sse(@Param('fingerprintReaderId') id: string, @Query('since') since?: string, @Query('pollMs') pollMs?: string,
  ): Observable<MessageEvent> {
    const initial = since ? new Date(since) : new Date();
    let last = isNaN(initial.getTime()) ? new Date() : initial;
    const period = Math.max(1000, Math.min(10000, Number(pollMs) || 2000));

    return interval(period).pipe(
      startWith(0),
      switchMap(async () => {
        const rows = await this.repo.getLogsSince(id, last);
        if (rows.length > 0) {
          const maxTs = rows.map((r) => r.timestamp ?? r.createAt ?? new Date()).reduce((a, b) => (a > b ? a : b));
          last = maxTs;
        }
        return rows.map((r) => AttendanceResponseMapper.toLogDto(r));
      }),
      map((payload) => ({ data: payload } as MessageEvent)),
    );
  }
}
