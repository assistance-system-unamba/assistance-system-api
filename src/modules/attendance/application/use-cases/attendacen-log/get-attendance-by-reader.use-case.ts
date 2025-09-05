import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../../domain/repositories/attendance.repository';
import { AttendanceLogEntity } from '../../../domain/entities/fingerprint-reader.entity';

@Injectable()
export class GetAttendanceByReaderUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository) {}
  execute(readerId: string): Promise<AttendanceLogEntity[]> {
    return this.repo.findAttendanceByReader(readerId);
  }
}
