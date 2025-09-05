import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../../domain/repositories/attendance.repository';

@Injectable()
export class UpdateAttendanceLogUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository) {}
  execute(logId: string, partial: any) {
    return this.repo.updateAttendanceLog(logId, partial);
  }
}
