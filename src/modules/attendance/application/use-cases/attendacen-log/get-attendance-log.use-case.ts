import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../../domain/repositories/attendance.repository';
import { AttendanceLogEntity } from '../../../domain/entities/fingerprint-reader.entity';

@Injectable()
export class GetAttendanceLogUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository) {}
  execute(logId: string): Promise<AttendanceLogEntity> {
    return this.repo.findAttendanceLogById(logId);
  }
}
