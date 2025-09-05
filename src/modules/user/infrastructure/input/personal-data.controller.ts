import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UpdatePersonalDataDto } from '../../application/dto/input/personal-data/update-personal-data.dto';
import { CreatePersonalDataUseCase } from '../../application/use-cases/personal-data/create-personal-data.use-case';
import { GetAllPersonalDataUseCase } from '../../application/use-cases/personal-data/get-all-personal-data.use-case';
import { GetPersonalDataUseCase } from '../../application/use-cases/personal-data/get-personal-data.use-case';
import { UpdatePersonalDataUseCase } from '../../application/use-cases/personal-data/update-personal-data.use-case';
import { DeletePersonalDataUseCase } from '../../application/use-cases/personal-data/delete-personal-data.use-case';
import { CreatePersonalDataDto } from '../../application/dto/input/personal-data/create-personal-data.dto';
import { PersonalDataResponseMapper } from '../output/mappers/personal-data-response.mapper';

@Controller('personal-data')
export class PersonalDataController {
  constructor(
    private readonly createUC: CreatePersonalDataUseCase,
    private readonly listUC: GetAllPersonalDataUseCase,
    private readonly getUC: GetPersonalDataUseCase,
    private readonly updateUC: UpdatePersonalDataUseCase,
    private readonly deleteUC: DeletePersonalDataUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreatePersonalDataDto) {
    const created = await this.createUC.execute({...dto,cellPhone:dto.cellPhone??""});
    return PersonalDataResponseMapper.toDto(created);
  }

  @Get()
  async findAll() {
    const list = await this.listUC.execute();
    return list.map(PersonalDataResponseMapper.toDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pd = await this.getUC.execute(id);
    return PersonalDataResponseMapper.toDto(pd);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePersonalDataDto) {
    const updated = await this.updateUC.execute(id, dto);
    return PersonalDataResponseMapper.toDto(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUC.execute(id);
    return { deleted: true };
  }
}
