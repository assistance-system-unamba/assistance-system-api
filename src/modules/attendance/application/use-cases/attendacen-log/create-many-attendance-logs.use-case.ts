import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../../domain/repositories/attendance.repository';
import { AttendanceLogEntity } from '../../../domain/entities/fingerprint-reader.entity';

@Injectable()
export class CreateManyAttendanceLogsUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository) {}
  execute(readerId: string, logs: Omit<AttendanceLogEntity, 'logId' | 'createAt' | 'fingerprintReaderId'>[]) {
    return this.repo.createManyAttendanceLogs(readerId, logs);
  }
}
