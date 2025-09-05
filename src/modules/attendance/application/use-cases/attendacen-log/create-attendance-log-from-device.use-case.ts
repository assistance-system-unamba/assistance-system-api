import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from '../../../domain/repositories/attendance.repository';
import { AttendanceLogEntity } from '../../../domain/entities/attendance-log.entity';

@Injectable()
export class CreateAttendanceLogFromDeviceUseCase {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly repo: IAttendanceRepository,
  ) {}

  async execute(data: {
    deviceUserId: string;
    recordTime: Date;
    ip: string;
  }): Promise<AttendanceLogEntity> {
    return this.repo.createAttendanceLogFromDevice(data);
  }
}
