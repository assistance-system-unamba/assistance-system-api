import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

import { ATTENDANCE_REPOSITORY } from './domain/repositories/attendance.repository';
import { PrismaAttendanceRepository } from './infrastructure/output/persistence/prisma-attendance.repository';

import { FingerprintReaderController } from './infrastructure/input/fingerprint-reader.controller';
import { AttendanceController } from './infrastructure/input/attendance.controller';

import { CreateFingerprintReaderUseCase } from './application/use-cases/fingerprint-reader/create-fingerprint-reader.use-case';
import { GetFingerprintReaderUseCase } from './application/use-cases/fingerprint-reader/get-fingerprint-reader.use-case';
import { GetAllFingerprintReadersUseCase } from './application/use-cases/fingerprint-reader/get-all-fingerprint-readers.use-case';
import { UpdateFingerprintReaderUseCase } from './application/use-cases/fingerprint-reader/update-fingerprint-reader.use-case';
import { DeleteFingerprintReaderUseCase } from './application/use-cases/fingerprint-reader/delete-fingerprint-reader.use-case';

import { CreateAttendanceLogUseCase } from './application/use-cases/attendacen-log/create-attendance-log.use-case';
import { CreateManyAttendanceLogsUseCase } from './application/use-cases/attendacen-log/create-many-attendance-logs.use-case';
import { GetAttendanceLogUseCase } from './application/use-cases/attendacen-log/get-attendance-log.use-case';
import { GetAttendanceByReaderUseCase } from './application/use-cases/attendacen-log/get-attendance-by-reader.use-case';
import { UpdateAttendanceLogUseCase } from './application/use-cases/attendacen-log/update-attendance-log.use-case';
import { DeleteAttendanceLogUseCase } from './application/use-cases/attendacen-log/delete-attendance-log.use-case';

import { IClockService } from './infrastructure/zkteco/iclock.service';
import { CreateAttendanceLogFromDeviceUseCase } from './application/use-cases/attendacen-log/create-attendance-log-from-device.use-case';
import { AttendanceEventsService } from './infrastructure/zkteco/attendance-events.service';

@Module({
  controllers: [FingerprintReaderController, AttendanceController,],
  providers: [
    PrismaService,
    { provide: ATTENDANCE_REPOSITORY, useClass: PrismaAttendanceRepository },

    // readers
    CreateFingerprintReaderUseCase,
    GetFingerprintReaderUseCase,
    GetAllFingerprintReadersUseCase,
    UpdateFingerprintReaderUseCase,
    DeleteFingerprintReaderUseCase,

    // logs
    CreateAttendanceLogUseCase,
    CreateManyAttendanceLogsUseCase,
    GetAttendanceLogUseCase,
    GetAttendanceByReaderUseCase,
    UpdateAttendanceLogUseCase,
    DeleteAttendanceLogUseCase,

    // device
    CreateAttendanceLogFromDeviceUseCase, 
    IClockService,
    AttendanceEventsService
  ],
})
export class AttendanceModule {}
