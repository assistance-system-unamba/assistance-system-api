import { AttendanceLogEntity, FingerprintReaderEntity } from '../../../domain/entities/fingerprint-reader.entity';
import { AttendanceLogResponseDto } from '../../../application/dto/output/attendance-log-response.dto';
import { FingerprintReaderResponseDto } from '../../../application/dto/output/fingerprint-reader-response.dto';

export class AttendanceResponseMapper {
  static toLogDto(log: AttendanceLogEntity): AttendanceLogResponseDto {
    return {
      logId: log.logId,
      timestamp: log.timestamp,
      status: log.status,
      createAt: log.createAt,
      fingerprintReaderId: log.fingerprintReaderId,
      participantId: log.participantId,
    };
  }

  static toReaderDto(reader: FingerprintReaderEntity): FingerprintReaderResponseDto {
    return {
      fingerprintReaderId: reader.fingerprintReaderId,
      ip: reader.ip,
      deviceSeries: reader.deviceSeries,
      name: reader.name,
      port: reader.port,
      location: reader.location,
      attendanceLogs: (reader.attendanceLogs ?? []).map((l) => AttendanceResponseMapper.toLogDto(l)),
    };
  }
}
