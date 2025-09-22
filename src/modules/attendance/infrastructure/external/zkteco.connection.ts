import { Injectable, OnModuleDestroy } from '@nestjs/common';
const Zkteco = require('zkteco-js');

@Injectable()
export class ZktecoConnection implements OnModuleDestroy {
  private dev: any;
  private connected = false;

  async connect(ip: string, port = 4370) {
    this.dev = new Zkteco(ip, port, 10000, 5000);
    await this.dev.createSocket();
    this.connected = true;
    console.log(`✅ Conectado a ZKTeco ${ip}:${port}`);
  }

  async startRealtime(callback: (log: any) => void) {
    if (!this.connected) throw new Error('ZKTeco no conectado');
    return this.dev.getRealTimeLogs(callback);
  }

  async disconnect() {
    if (!this.connected) return;
    await this.dev.disconnect();
    this.connected = false;
  }

  async onModuleDestroy() {
    try { await this.disconnect(); } catch {}
  }
}
