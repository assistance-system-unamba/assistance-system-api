import { ParticipantController } from './infrastructure/input/participant.controller';
import { PersonalDataController } from './infrastructure/input/personal-data.controller';
import { CreatePersonalDataUseCase } from './application/use-cases/personal-data/create-personal-data.use-case';
import { GetAllPersonalDataUseCase } from './application/use-cases/personal-data/get-all-personal-data.use-case';
import { GetPersonalDataUseCase } from './application/use-cases/personal-data/get-personal-data.use-case';
import { UpdatePersonalDataUseCase } from './application/use-cases/personal-data/update-personal-data.use-case';
import { DeletePersonalDataUseCase } from './application/use-cases/personal-data/delete-personal-data.use-case';
import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/input/user.controller';
import { PrismaService } from 'src/config/prisma.service';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/output/persistence/prisma-user.repository';
import { PARTICIPANT_REPOSITORY } from './domain/repositories/participant.repository';
import { PrismaParticipantRepository } from './infrastructure/output/persistence/prisma-participant.repository';
import { PERSONAL_DATA_REPOSITORY } from './domain/repositories/personal-data.repository';
import { PrismaPersonalDataRepository } from './infrastructure/output/persistence/prisma-personal-data.repository';
import { CreateUserUseCase } from './application/use-cases/user/create-user.use-case';
import { GetAllUsersUseCase } from './application/use-cases/user/get-all-users.use-case';
import { GetUserUseCase } from './application/use-cases/user/get-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/user/delete-user.use-case';
import { CreateParticipantUseCase } from './application/use-cases/paticipant/create-participant.use-case';
import { GetAllParticipantsUseCase } from './application/use-cases/paticipant/get-all-participants.use-case';
import { GetParticipantUseCase } from './application/use-cases/paticipant/get-participant.use-case';
import { UpdateParticipantUseCase } from './application/use-cases/paticipant/update-participant.use-case';
import { DeleteParticipantUseCase } from './application/use-cases/paticipant/delete-participant.use-case';
import { PasswordService } from '../auth/application/services/password.service';

@Module({
  controllers: [
    UserController,
    ParticipantController,
    PersonalDataController,
  ],
  providers: [
    PrismaService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: PARTICIPANT_REPOSITORY, useClass: PrismaParticipantRepository },
    { provide: PERSONAL_DATA_REPOSITORY, useClass: PrismaPersonalDataRepository },

    // Users
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,

    // Participants
    CreateParticipantUseCase,
    GetAllParticipantsUseCase,
    GetParticipantUseCase,
    UpdateParticipantUseCase,
    DeleteParticipantUseCase,

    // PersonalData
    CreatePersonalDataUseCase,
    GetAllPersonalDataUseCase,
    GetPersonalDataUseCase,
    UpdatePersonalDataUseCase,
    DeletePersonalDataUseCase,
    PasswordService
  ],
})
export class UserModule {}
