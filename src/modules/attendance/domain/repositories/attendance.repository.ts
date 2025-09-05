export const ATTENDANCE_REPOSITORY = 'ATTENDANCE_REPOSITORY';

import { AttendanceLogEntity, FingerprintReaderEntity } from '../entities/fingerprint-reader.entity';

export interface IAttendanceRepository {
  // Fingerprint Readers
  createFingerprintReader(
    reader: Omit<FingerprintReaderEntity, 'fingerprintReaderId' | 'attendanceLogs'>,
    logs?: Omit<AttendanceLogEntity, 'logId' | 'createAt' | 'fingerprintReaderId'>[],
  ): Promise<FingerprintReaderEntity>;

  findFingerprintReaderById(id: string): Promise<FingerprintReaderEntity>;
  findAllFingerprintReaders(): Promise<FingerprintReaderEntity[]>;
  updateFingerprintReader(
    id: string,
    partial: Partial<Omit<FingerprintReaderEntity, 'fingerprintReaderId' | 'attendanceLogs'>>,
  ): Promise<FingerprintReaderEntity>;
  deleteFingerprintReader(id: string): Promise<void>;

  // Attendance Logs
  createAttendanceLog(
    readerId: string,
    log: Omit<AttendanceLogEntity, 'logId' | 'createAt' | 'fingerprintReaderId'>,
  ): Promise<AttendanceLogEntity>;

  createManyAttendanceLogs(
    readerId: string,
    logs: Omit<AttendanceLogEntity, 'logId' | 'createAt' | 'fingerprintReaderId'>[],
  ): Promise<AttendanceLogEntity[]>;

  findAttendanceLogById(logId: string): Promise<AttendanceLogEntity>;
  findAttendanceByReader(readerId: string): Promise<AttendanceLogEntity[]>;
  updateAttendanceLog(
    logId: string,
    partial: Partial<Omit<AttendanceLogEntity, 'logId' | 'createAt' | 'fingerprintReaderId'>>,
  ): Promise<AttendanceLogEntity>;
  deleteAttendanceLog(logId: string): Promise<void>;

  // Real-time support
  getLogsSince(readerId: string, since: Date): Promise<AttendanceLogEntity[]>;

  createAttendanceLogFromDevice(data: {
    deviceUserId: string;
    recordTime: Date;
    ip: string;
  }): Promise<AttendanceLogEntity>;
}
