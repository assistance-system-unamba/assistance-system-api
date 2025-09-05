import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../../domain/repositories/attendance.repository';
import { FingerprintReaderEntity } from '../../../domain/entities/fingerprint-reader.entity';

@Injectable()
export class GetFingerprintReaderUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository) {}
  execute(id: string): Promise<FingerprintReaderEntity> {
    return this.repo.findFingerprintReaderById(id);
  }
}
