import { Injectable } from '@nestjs/common';
import { ZktecoConnection } from '../../infrastructure/external/zkteco.connection';
import { CreateAttendanceLogFromDeviceUseCase } from '../use-cases/attendacen-log/create-attendance-log-from-device.use-case';

@Injectable()
export class AttendanceDeviceService {
  constructor(
    private readonly zk: ZktecoConnection,
    private readonly createAttendanceFromDevice: CreateAttendanceLogFromDeviceUseCase,
  ) {}

  async start(ip: string, port = 4370) {
    await this.zk.connect(ip, port);

    await this.zk.startRealtime(async (log: any) => {
      // log esperado: { userId, timestamp, ... }
      await this.createAttendanceFromDevice.execute({
        deviceUserId: `${log.userId ?? ''}`,
        recordTime: new Date(log.timestamp),
        ip,
      });
    });
  }

  async stop() {
    await this.zk.disconnect();
  }
}
