import {
  Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Sse, MessageEvent,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Observable, interval, map, startWith, switchMap } from 'rxjs';

import { AttendanceResponseMapper } from '../output/mappers/attendance-response.mapper';
import { AttendanceLogResponseDto } from '../../application/dto/output/attendance-log-response.dto';

import { CreateAttendanceLogUseCase } from '../../application/use-cases/attendacen-log/create-attendance-log.use-case';
import { CreateManyAttendanceLogsUseCase } from '../../application/use-cases/attendacen-log/create-many-attendance-logs.use-case';
import { GetAttendanceLogUseCase } from '../../application/use-cases/attendacen-log/get-attendance-log.use-case';
import { GetAttendanceByReaderUseCase } from '../../application/use-cases/attendacen-log/get-attendance-by-reader.use-case';
import { UpdateAttendanceLogUseCase } from '../../application/use-cases/attendacen-log/update-attendance-log.use-case';
import { DeleteAttendanceLogUseCase } from '../../application/use-cases/attendacen-log/delete-attendance-log.use-case';

import { CreateAttendanceLogDto } from '../../application/dto/input/attendance-log/create-attendance-log.dto';
import { CreateManyAttendanceLogsDto } from '../../application/dto/input/attendance-log/create-many-attendance-logs.dto';
import { UpdateAttendanceLogDto } from '../../application/dto/input/attendance-log/update-attendance-log.dto';

import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../domain/repositories/attendance.repository';

@Controller('attendance-logs')
export class AttendanceLogController {
  constructor(
    private readonly createLogUC: CreateAttendanceLogUseCase,
    private readonly createManyLogsUC: CreateManyAttendanceLogsUseCase,
    private readonly getLogUC: GetAttendanceLogUseCase,
    private readonly getByReaderUC: GetAttendanceByReaderUseCase,
    private readonly updateLogUC: UpdateAttendanceLogUseCase,
    private readonly deleteLogUC: DeleteAttendanceLogUseCase,
    @Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository,
  ) {}

  /** Crear un log manual */
  @Post()
  async create(@Body() dto: CreateAttendanceLogDto): Promise<AttendanceLogResponseDto> {
    const created = await this.createLogUC.execute(dto.fingerprintReaderId, {
      timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
      status: dto.status ?? 'PRESENT',
      participantId: dto.participantId ?? '',
    });
    return AttendanceResponseMapper.toLogDto(created);
  }

  /** Crear varios logs */
  @Post('bulk')
  async createMany(@Body() dto: CreateManyAttendanceLogsDto) {
    const created = await this.createManyLogsUC.execute(
      dto.fingerprintReaderId,
      (dto.logs ?? []).map((l) => ({
        timestamp: l.timestamp ? new Date(l.timestamp) : new Date(),
        status: l.status ?? 'PRESENT',
        participantId: l.participantId ?? '',
      })),
    );
    return created.map((r) => AttendanceResponseMapper.toLogDto(r));
  }

  /** Listar logs (opcional: por reader) con límite y orden desc */
  @Get()
  async findAll(
    @Query('readerId') readerId?: string,
    @Query('limit') limitStr?: string,
  ): Promise<AttendanceLogResponseDto[]> {
    const limit = Math.max(1, Math.min(100, Number(limitStr) || 50));
    const rows = await this.repo.findLatestLogs(limit, readerId || undefined);
    return rows.map(AttendanceResponseMapper.toLogDto);
  }

  /** Obtener log por id */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AttendanceLogResponseDto> {
    const log = await this.getLogUC.execute(id);
    return AttendanceResponseMapper.toLogDto(log);
  }

  /** Último log (opcional: por reader) */
  @Get('utils/last')
  async findLast(@Query('readerId') readerId?: string): Promise<AttendanceLogResponseDto | {}> {
    const last = await this.repo.getLastLog(readerId || undefined);
    return last ? AttendanceResponseMapper.toLogDto(last) : {};
  }

  /** Últimos N logs (default 10) para dashboard */
  @Get('utils/latest')
  async latest(@Query('limit') limitStr?: string, @Query('readerId') readerId?: string) {
    const limit = Math.max(1, Math.min(50, Number(limitStr) || 10));
    const rows = await this.repo.findLatestLogs(limit, readerId || undefined);
    return rows.map(AttendanceResponseMapper.toLogDto);
  }

  /** Logs por reader (compat) */
  @Get('by-reader/:id')
  async findByReader(@Param('id') id: string): Promise<AttendanceLogResponseDto[]> {
    const rows = await this.getByReaderUC.execute(id);
    return rows.map((r) => AttendanceResponseMapper.toLogDto(r));
  }

  /** Actualizar log */
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAttendanceLogDto) {
    const updated = await this.updateLogUC.execute(id, {
      timestamp: dto.timestamp ? new Date(dto.timestamp) : undefined,
      status: dto.status ?? undefined,
      participantId: dto.participantId ?? undefined,
    });
    return AttendanceResponseMapper.toLogDto(updated);
  }

  /** Eliminar log */
  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.deleteLogUC.execute(id);
    return { __message: 'AttendanceLog eliminado' };
  }

  /**
   * SSE — Emite los últimos N logs (por defecto 10) y sigue emitiendo cada pollMs.
   * Si pasas since, solo emitirá los nuevos posteriores a esa fecha.
   * GET /attendance-logs/stream?limit=10&since=2025-09-01T00:00:00.000Z&pollMs=2000&readerId=xxx
   */
  @Sse('stream')
  sse(
    @Query('limit') limitStr?: string,
    @Query('since') since?: string,
    @Query('pollMs') pollMs?: string,
    @Query('readerId') readerId?: string,
  ): Observable<MessageEvent> {
    const period = Math.max(1000, Math.min(10000, Number(pollMs) || 2000));
    const limit = Math.max(1, Math.min(50, Number(limitStr) || 10));

    // Punto de corte de “novedades”
    const initial = since ? new Date(since) : new Date(0); // si no hay since, manda últimos N y continúa
    let last = isNaN(initial.getTime()) ? new Date(0) : initial;

    return interval(period).pipe(
      startWith(0),
      switchMap(async () => {
        // 1) Si since == 0: al primer tick devuelve últimos N (para "llenar" UI)
        if (last.getTime() === 0) {
          const rows = await this.repo.findLatestLogs(limit, readerId || undefined);
          // Mueve el "cursor" a la fecha máx retornada, para siguientes ticks
          const maxTs =
            rows.length > 0
              ? rows
                  .map((r) => r.timestamp ?? r.createAt ?? new Date())
                  .reduce((a, b) => (a > b ? a : b))
              : new Date();
          last = maxTs;
          return rows.map(AttendanceResponseMapper.toLogDto);
        }

        // 2) Luego: solo lo nuevo
        const rows = await this.repo.getLogsSinceGlobal(last, readerId || undefined);
        if (rows.length > 0) {
          const maxTs = rows
            .map((r) => r.timestamp ?? r.createAt ?? new Date())
            .reduce((a, b) => (a > b ? a : b));
          last = maxTs;
        }
        return rows.map(AttendanceResponseMapper.toLogDto);
      }),
      map((payload) => ({ data: payload } as MessageEvent)),
    );
  }
}
