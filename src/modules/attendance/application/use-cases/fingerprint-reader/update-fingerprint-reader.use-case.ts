import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../../domain/repositories/attendance.repository';
import { FingerprintReaderEntity } from '../../../domain/entities/fingerprint-reader.entity';

@Injectable()
export class UpdateFingerprintReaderUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository) {}
  execute(id: string, partial: Partial<Omit<FingerprintReaderEntity, 'fingerprintReaderId' | 'attendanceLogs'>>) {
    return this.repo.updateFingerprintReader(id, partial);
  }
}
