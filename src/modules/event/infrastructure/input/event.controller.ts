import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MaterialResponseDto } from '../../application/dto/output/material-response.dto';
import { CreateEventUseCase } from '../../application/use-cases/event/create-event.use-case';
import { GetEventUseCase } from '../../application/use-cases/event/get-event.use-case';
import { GetAllEventsUseCase } from '../../application/use-cases/event/get-all-events.use-case';
import { UpdateEventUseCase } from '../../application/use-cases/event/update-event.use-case';
import { DeleteEventUseCase } from '../../application/use-cases/event/delete-event.use-case';
import { CreateManyMaterialsUseCase } from '../../application/use-cases/material/create-many-materials.use-case';
import { EventResponseDto } from '../../application/dto/output/event-response.dto';
import { CreateEventDto } from '../../application/dto/input/event/create-event.dto';
import { EventResponseMapper } from '../output/mappers/event-response.mapper';
import { UpdateEventDto } from '../../application/dto/input/event/update-event.dto';
import { CreateManyMaterialsDto } from '../../application/dto/input/material/create-many-materials.dto';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(
    private readonly createEventUC: CreateEventUseCase,
    private readonly getEventUC: GetEventUseCase,
    private readonly getAllEventsUC: GetAllEventsUseCase,
    private readonly updateEventUC: UpdateEventUseCase,
    private readonly deleteEventUC: DeleteEventUseCase,
    private readonly createManyMaterialsUC: CreateManyMaterialsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear evento (materiales opcionales en el mismo POST)' })
  @ApiResponse({ status: 201, type: EventResponseDto })
  async create(@Body() dto: CreateEventDto): Promise<EventResponseDto> {

    const mappedMaterials =(dto.materials ?? []).map((m) => ({
      materialUrl: m.materialUrl ?? null,
      title: m.title ?? null,
      description: m.description ?? null,
      type: m.type ?? null,
    }));

    const event = await this.createEventUC.execute(
        {
        title: dto.title ?? null,
        description: dto.description ?? null,
        startTime: dto.startTime ? new Date(dto.startTime) : null,
        endTime: dto.endTime ? new Date(dto.endTime) : null,
        place: dto.place ?? null,
        imageUrl:dto.imageUrl,
        materials: [],
        },
        mappedMaterials,
    );

    return EventResponseMapper.toEventDto(event);
  }


  @Get()
  @ApiOperation({ summary: 'Listar eventos (ordenados por createAt desc)' })
  @ApiResponse({ status: 200, type: [EventResponseDto] })
  async findAll(): Promise<EventResponseDto[]> {
    const list = await this.getAllEventsUC.execute();
    return list.map(EventResponseMapper.toEventDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener evento por ID' })
  @ApiParam({ name: 'id', required: true, description: 'UUID v4 del evento' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<EventResponseDto> {
    const event = await this.getEventUC.execute(id);
    return EventResponseMapper.toEventDto(event);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar evento' })
  @ApiParam({ name: 'id', required: true, description: 'UUID v4 del evento' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    const updated = await this.updateEventUC.execute(id, {
      title: dto.title ?? undefined,
      description: dto.description ?? undefined,
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      place: dto.place ?? undefined,
    });
    return EventResponseMapper.toEventDto(updated);
  }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar evento (borra materiales primero)' })
    @ApiParam({ name: 'id', required: true, description: 'UUID v4 del evento' })
    @ApiResponse({
    status: 200,
    description: 'Eliminado',
        schema: { example: { success: true, message: 'Evento eliminado', data: null } },
    })
    async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        await this.deleteEventUC.execute(id);
        return { __message: 'Evento eliminado' }; // <-- lo toma el interceptor
    }


  @Post(':id/materials')
  @ApiOperation({ summary: 'Agregar varios materiales a un evento' })
  @ApiParam({ name: 'id', required: true, description: 'UUID v4 del evento' })
  @ApiResponse({ status: 201, type: [MaterialResponseDto] })
  async addMaterials(
    @Param('id', new ParseUUIDPipe({ version: '4' })) eventId: string,
    @Body() dto: CreateManyMaterialsDto,
  ) {
    const created = await this.createManyMaterialsUC.execute(
      eventId,
      (dto.materials ?? []).map((m) => ({
        materialUrl: m.materialUrl ?? null,
        title: m.title ?? null,
        description: m.description ?? null,
        type: m.type ?? null,
      })),
    );
    return created.map(EventResponseMapper.toMaterialDto);
  }
}
