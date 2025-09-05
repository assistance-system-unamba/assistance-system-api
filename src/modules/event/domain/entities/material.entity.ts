import { UUID } from "src/shared/value-objects/uuid.vo";

export class Material {
    constructor(
      public readonly materialId: UUID,
      public materialUrl: string | null,
      public title: string | null,
      public description: string | null,
      public type: string | null,
      public readonly createAt: Date = new Date(),
      public event: Event | null = null,
    ) {}
}