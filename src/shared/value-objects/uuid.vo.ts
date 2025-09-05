import { v4 as uuidv4 } from 'uuid';

export class UUID {
  private constructor(private readonly value: string) {}

  static create(value?: string): UUID {
    if (value && !UUID.isValid(value)) {
      throw new Error(`Invalid UUID: ${value}`);
    }
    return new UUID(value ?? uuidv4());
  }

  static isValid(value: string): boolean {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(value);
  }

  toString(): string {
    return this.value;
  }
}
