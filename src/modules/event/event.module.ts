import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { EVENT_REPOSITORY } from './domain/repositories/event.repository';
import { PrismaEventRepository } from './infrastructure/output/persistence/prisma-event.repository';
import { EventController } from './infrastructure/input/event.controller';
import { MaterialController } from './infrastructure/input/material.controller';
import { CreateEventUseCase } from './application/use-cases/event/create-event.use-case';
import { GetEventUseCase } from './application/use-cases/event/get-event.use-case';
import { GetAllEventsUseCase } from './application/use-cases/event/get-all-events.use-case';
import { UpdateEventUseCase } from './application/use-cases/event/update-event.use-case';
import { DeleteEventUseCase } from './application/use-cases/event/delete-event.use-case';
import { CreateMaterialUseCase } from './application/use-cases/material/create-material.use-case';
import { CreateManyMaterialsUseCase } from './application/use-cases/material/create-many-materials.use-case';
import { GetMaterialUseCase } from './application/use-cases/material/get-material.use-case';
import { GetMaterialsByEventUseCase } from './application/use-cases/material/get-materials-by-event.use-case';
import { UpdateMaterialUseCase } from './application/use-cases/material/update-material.use-case';
import { DeleteMaterialUseCase } from './application/use-cases/material/delete-material.use-case';

@Module({
  controllers: [EventController, MaterialController],
  providers: [
    PrismaService,
    { provide: EVENT_REPOSITORY, useClass: PrismaEventRepository },

    CreateEventUseCase,
    GetEventUseCase,
    GetAllEventsUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,

    CreateMaterialUseCase,
    CreateManyMaterialsUseCase,
    GetMaterialUseCase,
    GetMaterialsByEventUseCase,
    UpdateMaterialUseCase,
    DeleteMaterialUseCase,
  ],
  exports: [],
})
export class EventModule {}
