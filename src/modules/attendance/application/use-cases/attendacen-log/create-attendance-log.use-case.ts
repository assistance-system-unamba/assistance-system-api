import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../../domain/repositories/attendance.repository';
import { AttendanceLogEntity } from '../../../domain/entities/fingerprint-reader.entity';

@Injectable()
export class CreateAttendanceLogUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository) {}
  execute(readerId: string, log: Omit<AttendanceLogEntity, 'logId' | 'createAt' | 'fingerprintReaderId'>) {
    return this.repo.createAttendanceLog(readerId, log);
  }
}
