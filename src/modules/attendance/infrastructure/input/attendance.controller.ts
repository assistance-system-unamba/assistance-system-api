// src/modules/attendance/infrastructure/input/attendance.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { Observable } from 'rxjs';
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
import { DeviceLogDto } from '../../application/dto/input/attendance-log/device-log.dto';
import { CreateAttendanceLogFromDeviceUseCase } from '../../application/use-cases/attendacen-log/create-attendance-log-from-device.use-case';
import { AttendanceEventsService } from '../zkteco/attendance-events.service';

@Controller()
export class AttendanceController {
  constructor(
    private readonly createLogUC: CreateAttendanceLogUseCase,
    private readonly createManyLogsUC: CreateManyAttendanceLogsUseCase,
    private readonly getLogUC: GetAttendanceLogUseCase,
    private readonly getByReaderUC: GetAttendanceByReaderUseCase,
    private readonly updateLogUC: UpdateAttendanceLogUseCase,
    private readonly deleteLogUC: DeleteAttendanceLogUseCase,
    private readonly createFromDeviceUC: CreateAttendanceLogFromDeviceUseCase,
    private readonly eventsService: AttendanceEventsService,
  ) {}

  /** 🔹 SSE: streaming en tiempo real */
  @Sse('attendance/stream')
  stream(): Observable<MessageEvent> {
    return this.eventsService.getStream();
  }

  /** Crear un log manual */
  @Post('attendance-logs')
  async create(@Body() dto: CreateAttendanceLogDto): Promise<AttendanceLogResponseDto> {
    const created = await this.createLogUC.execute(dto.fingerprintReaderId, {
      timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
      status: dto.status ?? 'PRESENT',
      participantId: dto.participantId ?? '',
    });
    return AttendanceResponseMapper.toLogDto(created);
  }

  /** Crear varios logs */
  @Post('fingerprint-readers/:id/attendance-logs')
  async createMany(@Param('id') id: string, @Body() dto: CreateManyAttendanceLogsDto) {
    const created = await this.createManyLogsUC.execute(
      id,
      (dto.logs ?? []).map((l) => ({
        timestamp: l.timestamp ? new Date(l.timestamp) : new Date(),
        status: l.status ?? 'PRESENT',
        participantId: l.participantId ?? '',
      })),
    );
    return created.map((r) => AttendanceResponseMapper.toLogDto(r));
  }

  /** Obtener log por id */
  @Get('attendance-logs/:id')
  async findOne(@Param('id') id: string): Promise<AttendanceLogResponseDto> {
    const log = await this.getLogUC.execute(id);
    return AttendanceResponseMapper.toLogDto(log);
  }

  /** Listar logs por reader */
  @Get('fingerprint-readers/:id/attendance-logs')
  async findByReader(@Param('id') id: string): Promise<AttendanceLogResponseDto[]> {
    const rows = await this.getByReaderUC.execute(id);
    return rows.map((r) => AttendanceResponseMapper.toLogDto(r));
  }

  /** Actualizar log */
  @Put('attendance-logs/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateAttendanceLogDto) {
    const updated = await this.updateLogUC.execute(id, {
      timestamp: dto.timestamp ? new Date(dto.timestamp) : undefined,
      status: dto.status ?? undefined,
      participantId: dto.participantId ?? undefined,
    });
    return AttendanceResponseMapper.toLogDto(updated);
  }

  /** Eliminar log */
  @Delete('attendance-logs/:id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.deleteLogUC.execute(id);
    return { __message: 'AttendanceLog eliminado' };
  }

  /** Crear log desde el dispositivo */
  @Post('attendance-logs/device')
  @HttpCode(201)
  async createFromDevice(@Body() dto: DeviceLogDto): Promise<AttendanceLogResponseDto> {
    const log = await this.createFromDeviceUC.execute({
      deviceUserId: dto.deviceUserId,
      recordTime: new Date(dto.recordTime),
      ip: dto.ip,
    });

    // Notificar en tiempo real
    this.eventsService.publish(log);

    return AttendanceResponseMapper.toLogDto(log);
  }
}
