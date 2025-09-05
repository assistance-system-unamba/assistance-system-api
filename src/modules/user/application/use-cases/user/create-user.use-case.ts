import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository';
import { IParticipantRepository, PARTICIPANT_REPOSITORY } from '../../../domain/repositories/participant.repository';
import { IPersonalDataRepository, PERSONAL_DATA_REPOSITORY } from '../../../domain/repositories/personal-data.repository';
import { User } from '../../../domain/entities/user.entity';
import { Participant } from '../../../domain/entities/participant.entity';
import { PersonalData } from '../../../domain/entities/personal-data.entity';
import { PasswordService } from 'src/modules/auth/application/services/password.service';
import { CreatePersonalDataDto } from '../../dto/input/personal-data/create-personal-data.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(PARTICIPANT_REPOSITORY) private readonly participantRepo: IParticipantRepository,
    @Inject(PERSONAL_DATA_REPOSITORY) private readonly personalDataRepo: IPersonalDataRepository,
    private readonly pwd: PasswordService,
  ) {}

  async execute(
    input: {
      role: number;
      userName: string;
      password: string;
      cardNumber?: string | null;
      personalData: CreatePersonalDataDto;
      participant: {
        faculty?: string | null; 
        career?: string | null; 
        type?: 'participant'|'speaker'|'teacher'|null;
        eventId: string;
      };
    }
  ): Promise<User> {
    return this.prisma.$transaction(async () => {
      const pd = PersonalData.create({
        name: input.personalData.name ?? null,
        lastName: input.personalData.lastName ?? null,
        dni: input.personalData.dni ?? null,
        dateBirth: input.personalData.dateBirth,
        email: input.personalData.email ?? null,
        cellPhone: input.personalData.cellPhone ?? null,
      });
      const savedPd = await this.personalDataRepo.create(pd);

      const participant = Participant.create({
        personalDataId: savedPd.getId(),
        eventId: input.participant.eventId??null,
        faculty: input.participant.faculty ?? null,
        career: input.participant.career ?? null,
        type: input.participant.type ?? null,
      });
      const savedParticipant = await this.participantRepo.create(participant);

      // 👉 HASH AQUÍ
      const hashed = await this.pwd.hash(input.password);

      const user = User.create({
        role: input.role ?? null,
        userName: input.userName.trim(),
        password: hashed,               // <- guardamos el hash bcrypt
        cardNumber: input.cardNumber ?? null,
        participantId: savedParticipant.getId(),
      });

      const savedUser = await this.userRepo.create(user);
      return savedUser;
    });
  }
}
