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
  