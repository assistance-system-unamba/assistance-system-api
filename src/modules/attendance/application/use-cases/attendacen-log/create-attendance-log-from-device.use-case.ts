import { Inject, Injectable } from "@nestjs/common";
import { ATTENDANCE_REPOSITORY, IAttendanceRepository } from "../../../domain/repositories/attendance.repository";

@Injectable()
export class CreateAttendanceLogFromDeviceUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repo: IAttendanceRepository) {}

  async execute(rawLog: { deviceUserId: string; recordTime: Date; ip: string }) {
    return this.repo.createAttendanceLogFromDevice(rawLog);
  }
}
