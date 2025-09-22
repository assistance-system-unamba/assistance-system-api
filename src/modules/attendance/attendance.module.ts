import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

import { ATTENDANCE_REPOSITORY } from './domain/repositories/attendance.repository';
import { PrismaAttendanceRepository } from './infrastructure/output/persistence/prisma-attendance.repository';

import { FingerprintReaderController } from './infrastructure/input/fingerprint-reader.controller';


import { ZktecoConnection } from './infrastructure/external/zkteco.connection';
import { AttendanceDeviceService } from './application/services/attendance-device.service';

// Use cases (attendance-log)
import { CreateAttendanceLogUseCase } from './application/use-cases/attendacen-log/create-attendance-log.use-case';
import { CreateManyAttendanceLogsUseCase } from './application/use-cases/attendacen-log/create-many-attendance-logs.use-case';
import { GetAttendanceLogUseCase } from './application/use-cases/attendacen-log/get-attendance-log.use-case';
import { GetAttendanceByReaderUseCase } from './application/use-cases/attendacen-log/get-attendance-by-reader.use-case';
import { UpdateAttendanceLogUseCase } from './application/use-cases/attendacen-log/update-attendance-log.use-case';
import { DeleteAttendanceLogUseCase } from './application/use-cases/attendacen-log/delete-attendance-log.use-case';
import { CreateAttendanceLogFromDeviceUseCase } from './application/use-cases/attendacen-log/create-attendance-log-from-device.use-case';

// Use cases (fingerprint-reader)
import { CreateFingerprintReaderUseCase } from './application/use-cases/fingerprint-reader/create-fingerprint-reader.use-case';
import { GetFingerprintReaderUseCase } from './application/use-cases/fingerprint-reader/get-fingerprint-reader.use-case';
import { GetAllFingerprintReadersUseCase } from './application/use-cases/fingerprint-reader/get-all-fingerprint-readers.use-case';
import { UpdateFingerprintReaderUseCase } from './application/use-cases/fingerprint-reader/update-fingerprint-reader.use-case';
import { DeleteFingerprintReaderUseCase } from './application/use-cases/fingerprint-reader/delete-fingerprint-reader.use-case';
import { AttendanceLogController } from './infrastructure/input/attendance.controller';
import { DeviceController } from './infrastructure/input/device.controller';

@Module({
  controllers: [AttendanceLogController, FingerprintReaderController, DeviceController],
  providers: [
    PrismaService,
    ZktecoConnection,
    AttendanceDeviceService,

    // Repo binding
    { provide: ATTENDANCE_REPOSITORY, useClass: PrismaAttendanceRepository },

    // Use cases (attendance-log)
    CreateAttendanceLogUseCase,
    CreateManyAttendanceLogsUseCase,
    GetAttendanceLogUseCase,
    GetAttendanceByReaderUseCase,
    UpdateAttendanceLogUseCase,
    DeleteAttendanceLogUseCase,
    CreateAttendanceLogFromDeviceUseCase,

    // Use cases (fingerprint-reader)
    CreateFingerprintReaderUseCase,
    GetFingerprintReaderUseCase,
    GetAllFingerprintReadersUseCase,
    UpdateFingerprintReaderUseCase,
    DeleteFingerprintReaderUseCase,
  ],
  exports: [{ provide: ATTENDANCE_REPOSITORY, useClass: PrismaAttendanceRepository }],
})
export class AttendanceModule {}
