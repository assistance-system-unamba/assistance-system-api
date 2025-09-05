import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { UUID } from 'src/shared/value-objects/uuid.vo';
import { IAttendanceRepository } from '../../../domain/repositories/attendance.repository';
import { AttendanceLogEntity, FingerprintReaderEntity } from '../../../domain/entities/fingerprint-reader.entity';
import { PrismaAttendanceMapper } from '../mappers/prisma-attendance.mapper';

@Injectable()
export class PrismaAttendanceRepository implements IAttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAttendanceLogFromDevice(data: {
    deviceUserId: string;
    recordTime: Date;
    ip: string;
  }): Promise<AttendanceLogEntity> {
    // 1. Verificar/crear lector
    let reader = await this.prisma.fingerprintReader.findFirst({ where: { ip: data.ip } });
    if (!reader) {
      reader = await this.prisma.fingerprintReader.create({
        data: {
          fingerprintReaderId: UUID.create().toString(),
          ip: data.ip,
          port: '4370',
          name: `Device-${data.ip}`,
          deviceSeries: 'iClock880',
          location: 'No definido',
        },
      });
    }

    // 2. Buscar usuario en BD por cardNumber
    let user = await this.prisma.user.findFirst({
      where: { cardNumber: data.deviceUserId },
      include: { participant: true },
    });

    // 👉 Si no existe, creamos automáticamente participant + user
    if (!user) {
      const participantId = UUID.create().toString();

      // Buscar evento activo o usar un default-event
      let event = await this.prisma.event.findFirst({
        orderBy: { startTime: 'desc' },
      });

      const eventId = event ? event.eventId : 'default-event';

      await this.prisma.participant.create({
        data: {
          participantId,
          faculty: 'Desconocida',
          career: 'Desconocida',
          type: 'participant',
          eventId, // 👈 obligatorio
          personalData: {
            create: {
              personalDataId: UUID.create().toString(),
              name: `User-${data.deviceUserId}`,
              lastName: 'Auto',
              dni: null,
              email: null,
              cellPhone: null,
            },
          },
        },
      });

      user = await this.prisma.user.create({
        data: {
          userName: `user_${data.deviceUserId}`,
          cardNumber: data.deviceUserId,
          role: 2,
          participantId,
        },
        include: { participant: true },
      });
    }

    if (!user || !user.participantId) {
      throw new Error(`❌ No se encontró usuario en BD para deviceUserId=${data.deviceUserId}`);
    }

    // 3. Determinar si es entrada o salida (pares=IN, impares=OUT)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingLogs = await this.prisma.attendanceLog.count({
      where: {
        participantId: user.participantId,
        timestamp: { gte: today },
      },
    });

    const status = existingLogs % 2 === 0 ? 'IN' : 'OUT';

    // 4. Insertar asistencia
    const created = await this.prisma.attendanceLog.create({
      data: {
        logId: UUID.create().toString(),
        fingerprintReaderId: reader.fingerprintReaderId,
        participantId: user.participantId,
        status,
        timestamp: data.recordTime,
      },
    });

    return PrismaAttendanceMapper.toLogEntity(created);
  }

  // ---------- Readers ----------
  async createFingerprintReader(
    reader: Omit<FingerprintReaderEntity, 'fingerprintReaderId' | 'attendanceLogs'>,
    logs?: Omit<AttendanceLogEntity, 'logId' | 'createAt' | 'fingerprintReaderId'>[],
  ): Promise<FingerprintReaderEntity> {
    const id = UUID.create().toString();

    const created = await this.prisma.fingerprintReader.create({
      data: {
        fingerprintReaderId: id,
        ip: reader.ip,
        deviceSeries: reader.deviceSeries,
        name: reader.name,
        port: reader.port,
        location: reader.location,
        ...(logs && logs.length
          ? {
              attendanceLogs: {
                create: logs.map((l) => ({
                  logId: UUID.create().toString(),
                  timestamp: l.timestamp ?? new Date(),
                  status: l.status ?? 'PRESENT',
                  participantId: l.participantId ?? '',
                })),
              },
            }
          : {}),
      },
      include: { attendanceLogs: true },
    });

    return PrismaAttendanceMapper.toReaderEntity(created);
  }

  async findFingerprintReaderById(id: string): Promise<FingerprintReaderEntity> {
    const found = await this.prisma.fingerprintReader.findUnique({
      where: { fingerprintReaderId: id },
      include: { attendanceLogs: true },
    });
    if (!found) throw new NotFoundException('FingerprintReader not found');
    return PrismaAttendanceMapper.toReaderEntity(found);
  }

  async findAllFingerprintReaders(): Promise<FingerprintReaderEntity[]> {
    const rows = await this.prisma.fingerprintReader.findMany({
      include: { attendanceLogs: true },
      orderBy: { name: 'asc' },
    });
    return rows.map((r) => PrismaAttendanceMapper.toReaderEntity(r));
  }

  async updateFingerprintReader(
    id: string,
    partial: Partial<Omit<FingerprintReaderEntity, 'fingerprintReaderId' | 'attendanceLogs'>>,
  ): Promise<FingerprintReaderEntity> {
    await this.ensureReaderExists(id);
    const updated = await this.prisma.fingerprintReader.update({
      where: { fingerprintReaderId: id },
      data: {
        ip: partial.ip,
        deviceSeries: partial.deviceSeries,
        name: partial.name,
        port: partial.port,
        location: partial.location,
      },
      include: { attendanceLogs: true },
    });
    return PrismaAttendanceMapper.toReaderEntity(updated);
  }

  async deleteFingerprintReader(id: string): Promise<void> {
    await this.ensureReaderExists(id);
    await this.prisma.$transaction([
      this.prisma.attendanceLog.deleteMany({ where: { fingerprintReaderId: id } }),
      this.prisma.fingerprintReader.delete({ where: { fingerprintReaderId: id } }),
    ]);
  }

  // ---------- Logs ----------
  async createAttendanceLog(
    readerId: string,
    log: Omit<AttendanceLogEntity, 'logId' | 'createAt' | 'fingerprintReaderId'>,
  ): Promise<AttendanceLogEntity> {
    await this.ensureReaderExists(readerId);
    const created = await this.prisma.attendanceLog.create({
      data: {
        logId: UUID.create().toString(),
        fingerprintReaderId: readerId,
        timestamp: log.timestamp ?? new Date(),
        status: log.status ?? 'PRESENT',
        participantId: log.participantId ?? '',
      },
    });
    return PrismaAttendanceMapper.toLogEntity(created);
  }

  async createManyAttendanceLogs(
    readerId: string,
    logs: Omit<AttendanceLogEntity, 'logId' | 'createAt' | 'fingerprintReaderId'>[],
  ): Promise<AttendanceLogEntity[]> {
    await this.ensureReaderExists(readerId);

    const created = await this.prisma.$transaction(
      logs.map((l) =>
        this.prisma.attendanceLog.create({
          data: {
            logId: UUID.create().toString(),
            fingerprintReaderId: readerId,
            timestamp: l.timestamp ?? new Date(),
            status: l.status ?? 'PRESENT',
            participantId: l.participantId ?? '',
          },
        }),
      ),
    );
    return created.map((r) => PrismaAttendanceMapper.toLogEntity(r));
  }

  async findAttendanceLogById(logId: string): Promise<AttendanceLogEntity> {
    const found = await this.prisma.attendanceLog.findUnique({ where: { logId } });
    if (!found) throw new NotFoundException('AttendanceLog not found');
    return PrismaAttendanceMapper.toLogEntity(found);
  }

  async findAttendanceByReader(readerId: string): Promise<AttendanceLogEntity[]> {
    await this.ensureReaderExists(readerId);
    const rows = await this.prisma.attendanceLog.findMany({
      where: { fingerprintReaderId: readerId },
      orderBy: [{ timestamp: 'desc' }, { createAt: 'desc' }],
    });
    return rows.map((r) => PrismaAttendanceMapper.toLogEntity(r));
  }

  async updateAttendanceLog(
    logId: string,
    partial: Partial<Omit<AttendanceLogEntity, 'logId' | 'createAt' | 'fingerprintReaderId'>>,
  ): Promise<AttendanceLogEntity> {
    await this.ensureLogExists(logId);
    const updated = await this.prisma.attendanceLog.update({
      where: { logId },
      data: {
        timestamp: partial.timestamp,
        status: partial.status,
        participantId: partial.participantId,
      },
    });
    return PrismaAttendanceMapper.toLogEntity(updated);
  }

  async deleteAttendanceLog(logId: string): Promise<void> {
    await this.ensureLogExists(logId);
    await this.prisma.attendanceLog.delete({ where: { logId } });
  }

  // ---------- Real-time ----------
  async getLogsSince(readerId: string, since: Date): Promise<AttendanceLogEntity[]> {
    await this.ensureReaderExists(readerId);
    const rows = await this.prisma.attendanceLog.findMany({
      where: {
        fingerprintReaderId: readerId,
        OR: [
          { timestamp: { gt: since } },
          { AND: [{ timestamp: null }, { createAt: { gt: since } }] },
        ],
      },
      orderBy: [{ timestamp: 'asc' }, { createAt: 'asc' }],
      take: 200,
    });
    return rows.map((r) => PrismaAttendanceMapper.toLogEntity(r));
  }

  // ---------- guards ----------
  private async ensureReaderExists(id: string) {
    const exists = await this.prisma.fingerprintReader.findUnique({
      where: { fingerprintReaderId: id },
      select: { fingerprintReaderId: true },
    });
    if (!exists) throw new NotFoundException('FingerprintReader not found');
  }

  private async ensureLogExists(id: string) {
    const exists = await this.prisma.attendanceLog.findUnique({
      where: { logId: id },
      select: { logId: true },
    });
    if (!exists) throw new NotFoundException('AttendanceLog not found');
  }
}
