export class EventEntity {
  constructor(
    public readonly eventId: string,
    public title: string | null,
    public description: string | null,
    public startTime: Date | null,
    public endTime: Date | null,
    public place: string | null,
    public readonly createAt: Date | null = null,
    public imageUrl?:string|null,
    public materials: MaterialEntity[] = [],
  ) {}

  static create(props: {
    eventId: string;
    title: string | null;
    description: string | null;
    startTime: Date | null;
    endTime: Date | null;
    place: string | null;
    createAt?: Date | null;
    imageUrl?:string|null;
    materials?: MaterialEntity[];
  }) {
    return new EventEntity(
      props.eventId,
      props.title,
      props.description,
      props.startTime,
      props.endTime,
      props.place,
      props.createAt ?? null,
      props.imageUrl,
      props.materials ?? [],
    );
  }
}

export class MaterialEntity {
  constructor(
    public readonly materialId: string,
    public materialUrl: string | null,
    public title: string | null,
    public description: string | null,
    public type: string | null,
    public readonly createAt: Date | null = null,
    public readonly eventId: string,
  ) {}

  static create(props: {
    materialId: string;
    materialUrl: string | null;
    title: string | null;
    description: string | null;
    type: string | null;
    createAt?: Date | null;
    eventId: string;
  }) {
    return new MaterialEntity(
      props.materialId,
      props.materialUrl,
      props.title,
      props.description,
      props.type,
      props.createAt ?? null,
      props.eventId,
    );
  }
}
