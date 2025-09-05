export class User {
  private constructor(
    private readonly userId: number | null,
    private role: number | null,
    private userName: string,
    private password: string,   // hashed o plano según tu flujo actual
    private cardNumber: string | null,
    private participantId: string,
  ) {}

  static create(props: {
    userId?: number | null;
    role?: number | null;
    userName: string;
    password: string;
    cardNumber?: string | null;
    participantId: string;
  }): User {
    return new User(
      props.userId ?? null,
      props.role ?? null,
      props.userName,
      props.password,
      props.cardNumber ?? null,
      props.participantId,
    );
  }

  getId() { return this.userId; }
  getRole() { return this.role; }
  getUserName() { return this.userName; }
  getPassword() { return this.password; }
  getCardNumber() { return this.cardNumber; }
  getParticipantId() { return this.participantId; }

  withId(id: number) {
    return User.create({
      userId: id,
      role: this.role,
      userName: this.userName,
      password: this.password,
      cardNumber: this.cardNumber,
      participantId: this.participantId,
    });
  }
}
