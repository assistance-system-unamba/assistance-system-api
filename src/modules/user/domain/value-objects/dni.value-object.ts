export class Dni {
    private constructor(private readonly value: string) {}
  
    static create(value: string): Dni {
      if (!/^\d{8}$/.test(value)) {
        throw new Error("Invalid DNI: must have exactly 8 digits");
      }
      return new Dni(value);
    }
  
    toString(): string {
      return this.value;
    }
  }
  