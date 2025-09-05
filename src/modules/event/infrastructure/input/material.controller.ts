import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventResponseMapper } from '../output/mappers/event-response.mapper';
import { MaterialResponseDto } from '../../application/dto/output/material-response.dto';
import { CreateMaterialUseCase } from '../../application/use-cases/material/create-material.use-case';
import { GetMaterialUseCase } from '../../application/use-cases/material/get-material.use-case';
import { GetMaterialsByEventUseCase } from '../../application/use-cases/material/get-materials-by-event.use-case';
import { UpdateMaterialUseCase } from '../../application/use-cases/material/update-material.use-case';
import { DeleteMaterialUseCase } from '../../application/use-cases/material/delete-material.use-case';
import { CreateMaterialDto } from '../../application/dto/input/material/create-material.dto';
import { UpdateMaterialDto } from '../../application/dto/input/material/update-material.dto';

@ApiTags('materials')
@Controller()
export class MaterialController {
    constructor(
        private readonly createMaterialUC: CreateMaterialUseCase,
        private readonly getMaterialUC: GetMaterialUseCase,
        private readonly getMaterialsByEventUC: GetMaterialsByEventUseCase,
        private readonly updateMaterialUC: UpdateMaterialUseCase,
        private readonly deleteMaterialUC: DeleteMaterialUseCase,
    ) {}

    @Post('materials')
    @ApiOperation({ summary: 'Crear material para un evento' })
    @ApiResponse({ status: 201, type: MaterialResponseDto })
    async create(@Body() dto: CreateMaterialDto): Promise<MaterialResponseDto> {
        const created = await this.createMaterialUC.execute(dto.eventId, {
        materialUrl: dto.materialUrl ?? null,
        title: dto.title ?? null,
        description: dto.description ?? null,
        type: dto.type ?? null,
        });
        return EventResponseMapper.toMaterialDto(created);
    }

    @Get('materials/:id')
    @ApiOperation({ summary: 'Obtener material por ID' })
    @ApiParam({ name: 'id', description: 'UUID v4 del material' })
    @ApiResponse({ status: 200, type: MaterialResponseDto })
    async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<MaterialResponseDto> {
        const material = await this.getMaterialUC.execute(id);
        return EventResponseMapper.toMaterialDto(material);
    }

    @Get('events/:eventId/materials')
    @ApiOperation({ summary: 'Listar materiales por evento' })
    @ApiParam({ name: 'eventId', description: 'UUID v4 del evento' })
    @ApiResponse({ status: 200, type: [MaterialResponseDto] })
    async findByEvent(@Param('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string): Promise<MaterialResponseDto[]> {
        const rows = await this.getMaterialsByEventUC.execute(eventId);
        return rows.map(EventResponseMapper.toMaterialDto);
    }

    @Put('materials/:id')
    @ApiOperation({ summary: 'Actualizar material' })
    @ApiParam({ name: 'id', description: 'UUID v4 del material' })
    @ApiResponse({ status: 200, type: MaterialResponseDto })
    async update(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() dto: UpdateMaterialDto,
    ): Promise<MaterialResponseDto> {
        const updated = await this.updateMaterialUC.execute(id, {
        materialUrl: dto.materialUrl ?? undefined,
        title: dto.title ?? undefined,
        description: dto.description ?? undefined,
        type: dto.type ?? undefined,
        });
        return EventResponseMapper.toMaterialDto(updated);
    }

    @Delete('materials/:id')
    @ApiOperation({ summary: 'Eliminar material' })
    @ApiParam({ name: 'id', description: 'UUID v4 del material' })
    @ApiResponse({
    status: 200,
    description: 'Eliminado',
    schema: { example: { 
        success: true, 
        message: 'Material eliminado', 
        data: null } },
    })
    async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        await this.deleteMaterialUC.execute(id);
        return { __message: 'Material eliminado' };
    }
}
