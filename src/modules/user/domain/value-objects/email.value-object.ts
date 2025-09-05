export class Email {
    private constructor(private readonly value: string) {
      if (!Email.isValid(value)) {
        throw new Error(`Invalid email: ${value}`);
      }
    }
  
    static create(value: string): Email {
      return new Email(value);
    }
  
    private static isValid(value: string): boolean {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value);
    }
  
    toString(): string {
      return this.value;
    }
  }
  