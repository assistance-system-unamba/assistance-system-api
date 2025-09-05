import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../../domain/repositories/attendance.repository';

@Injectable()
export class DeleteAttendanceLogUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository) {}
  execute(logId: string) {
    return this.repo.deleteAttendanceLog(logId);
  }
}
