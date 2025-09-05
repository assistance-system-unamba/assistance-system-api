// src/modules/attendance/infrastructure/zkteco/iclock.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateAttendanceLogFromDeviceUseCase } from '../../application/use-cases/attendacen-log/create-attendance-log-from-device.use-case';
import { AttendanceEventsService } from './attendance-events.service';

const ZKLib = require('node-zklib');

@Injectable()
export class IClockService implements OnModuleInit {
  private readonly logger = new Logger(IClockService.name);
  private zkInstance: any;

  private lastEvents: Record<string, number> = {}; // { userId: timestamp }

  constructor(
    private readonly createFromDeviceUC: CreateAttendanceLogFromDeviceUseCase,
    private readonly eventsService: AttendanceEventsService,
  ) {}

  async onModuleInit() {
    this.zkInstance = new ZKLib('192.168.1.117', 4370, 10000, 4000);

    try {
      await this.zkInstance.createSocket();
      this.logger.log('✅ Conectado al iClock880');

      this.zkInstance.getRealTimeLogs(async (data: any) => {
        this.logger.debug(`📥 LOG CRUDO: ${JSON.stringify(data)}`);

        const deviceUserId = (data.userId ?? data.uid)?.toString();
        const recordTime = new Date(
          data.recordTime ?? data.timestamp ?? Date.now(),
        );

        // Debounce: ignorar si mismo user marcó en <2s
        const lastTime = this.lastEvents[deviceUserId] ?? 0;
        if (Date.now() - lastTime < 2000) {
          this.logger.debug(`⏩ Evento duplicado ignorado para user=${deviceUserId}`);
          return;
        }
        this.lastEvents[deviceUserId] = Date.now();

        try {
          const log = await this.createFromDeviceUC.execute({
            deviceUserId,
            recordTime,
            ip: this.zkInstance.ip,
          });

          this.logger.log(`✅ Log guardado en BD: ${JSON.stringify(log)}`);
          this.eventsService.publish(log);
        } catch (err) {
          this.logger.error(`❌ Error guardando log en BD: ${err.message}`);
        }
      });
    } catch (e) {
      this.logger.error('❌ Error conectando al dispositivo', e);
    }
  }
}
