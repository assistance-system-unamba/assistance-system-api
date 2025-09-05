import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateParticipantDto } from '../../application/dto/input/participant/create-participant.dto';
import { CreateParticipantUseCase } from '../../application/use-cases/paticipant/create-participant.use-case';
import { GetAllParticipantsUseCase } from '../../application/use-cases/paticipant/get-all-participants.use-case';
import { GetParticipantUseCase } from '../../application/use-cases/paticipant/get-participant.use-case';
import { UpdateParticipantUseCase } from '../../application/use-cases/paticipant/update-participant.use-case';
import { DeleteParticipantUseCase } from '../../application/use-cases/paticipant/delete-participant.use-case';
import { UpdateParticipantDto } from '../../application/dto/input/participant/update-participant.dto';
import { ParticipantResponseMapper } from '../output/mappers/participant-response.mapper';

@Controller('participants')
export class ParticipantController {
  constructor(
    private readonly createUC: CreateParticipantUseCase,
    private readonly listUC: GetAllParticipantsUseCase,
    private readonly getUC: GetParticipantUseCase,
    private readonly updateUC: UpdateParticipantUseCase,
    private readonly deleteUC: DeleteParticipantUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateParticipantDto) {
    const created = await this.createUC.execute({
      faculty: dto.faculty ?? null,
      career: dto.career ?? null,
      type: dto.type ?? null,
      personalDataId: dto.personalDataId,
      eventId: dto.eventId,
    });
    return ParticipantResponseMapper.toDto(created);
  }

  @Get()
  async findAll() {
    const list = await this.listUC.execute();
    return list.map(ParticipantResponseMapper.toDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const p = await this.getUC.execute(id);
    return ParticipantResponseMapper.toDto(p);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateParticipantDto) {
    const updated = await this.updateUC.execute(id, dto);
    return ParticipantResponseMapper.toDto(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUC.execute(id);
    return { deleted: true };
  }
}
