export class FingerprintReaderEntity {
  constructor(
    public readonly fingerprintReaderId: string,
    public ip: string | null,
    public deviceSeries: string | null,
    public name: string | null,
    public port: string | null,
    public location: string | null,
    public attendanceLogs: AttendanceLogEntity[] = [],
  ) {}

  static create(props: {
    fingerprintReaderId: string;
    ip: string | null;
    deviceSeries: string | null;
    name: string | null;
    port: string | null;
    location: string | null;
    attendanceLogs?: AttendanceLogEntity[];
  }) {
    return new FingerprintReaderEntity(
      props.fingerprintReaderId,
      props.ip,
      props.deviceSeries,
      props.name,
      props.port,
      props.location,
      props.attendanceLogs ?? [],
    );
  }
}

export class AttendanceLogEntity {
  constructor(
    public readonly logId: string,
    public timestamp: Date | null,
    public status: string | null,
    public readonly createAt: Date | null,
    public readonly fingerprintReaderId: string,
    public participantId: string,
  ) {}

  static create(props: {
    logId: string;
    timestamp: Date | null;
    status: string | null;
    createAt: Date | null;
    fingerprintReaderId: string;
    participantId: string;
  }) {
    return new AttendanceLogEntity(
      props.logId,
      props.timestamp,
      props.status,
      props.createAt,
      props.fingerprintReaderId,
      props.participantId,
    );
  }
}
