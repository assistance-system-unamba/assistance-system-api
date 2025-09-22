import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { AttendanceDeviceService } from '../../application/services/attendance-device.service';

@Controller('devices/zkteco')
export class DeviceController {
  constructor(private readonly deviceSvc: AttendanceDeviceService) {}

  /** Conecta a un dispositivo */
  @Post('connect/:ip')
  @HttpCode(200)
  async connect(@Param('ip') ip: string, @Body('port') port?: number) {
    await this.deviceSvc.start(ip, port || 4370);
    return { ok: true, message: `Conectado y escuchando realtime en ${ip}:${port || 4370}` };
  }

  /** Detiene realtime y desconecta */
  @Post('stop')
  @HttpCode(200)
  async stop() {
    await this.deviceSvc.stop();
    return { ok: true, message: 'Desconectado' };
  }
}
