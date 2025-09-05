export class PhoneNumber {
    private constructor(private readonly value: string) {}
  
    static create(value: string): PhoneNumber {
      if (!/^\d{6,12}$/.test(value)) {
        throw new Error("Invalid phone number: must have 6–12 digits");
      }
      return new PhoneNumber(value);
    }
  
    toString(): string {
      return this.value;
    }
  }
  