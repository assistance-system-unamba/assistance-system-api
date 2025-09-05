import { AttendanceLogEntity, FingerprintReaderEntity } from '../../../domain/entities/fingerprint-reader.entity';

export class PrismaAttendanceMapper {
  static toReaderEntity(raw: any): FingerprintReaderEntity {
    const logs = Array.isArray(raw.attendanceLogs) ? raw.attendanceLogs : [];
    return FingerprintReaderEntity.create({
      fingerprintReaderId: raw.fingerprintReaderId,
      ip: raw.ip ?? null,
      deviceSeries: raw.deviceSeries ?? null,
      name: raw.name ?? null,
      port: raw.port ?? null,
      location: raw.location ?? null,
      attendanceLogs: logs.map((l) => PrismaAttendanceMapper.toLogEntity(l)),
    });
  }

  static toLogEntity(raw: any): AttendanceLogEntity {
    return AttendanceLogEntity.create({
      logId: raw.logId,
      timestamp: raw.timestamp ?? null,
      status: raw.status ?? null,
      createAt: raw.createAt ?? null,
      fingerprintReaderId: raw.fingerprintReaderId,
      participantId: raw.participantId,
    });
  }
}
