import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../../domain/repositories/attendance.repository';
import { FingerprintReaderEntity, AttendanceLogEntity } from '../../../domain/entities/fingerprint-reader.entity';

@Injectable()
export class CreateFingerprintReaderUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository) {}

  execute(
    reader: Omit<FingerprintReaderEntity, 'fingerprintReaderId' | 'attendanceLogs'>,
    logs?: Omit<AttendanceLogEntity, 'logId' | 'createAt' | 'fingerprintReaderId'>[],
  ) {
    return this.repo.createFingerprintReader(reader, logs);
  }
}
