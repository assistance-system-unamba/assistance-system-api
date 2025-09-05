import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/user/create-user.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/user/get-all-users.use-case';
import { GetUserUseCase } from '../../application/use-cases/user/get-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/user/delete-user.use-case';
import { CreateUserDto } from '../../application/dto/input/user/create-user.dto';
import { UpdateUserDto } from '../../application/dto/input/user/update-user.dto';
import { UserResponseMapper } from '../output/mappers/user-response.mapper';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/value-objects/role.enum';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getAllUsers: GetAllUsersUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  // Crear User + Participant + PersonalData (transaccional)
  // role: dto.role ?? null,
  //     userName: dto.userName,
  //     password: dto.password,
  //     cardNumber: dto.cardNumber ?? null,
  //     personalData: dto.personalData,
  //     participant: dto.participant,
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const created = await this.createUser.execute({...dto,cardNumber:dto.cardNumber??null});
    return UserResponseMapper.toDto(created);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get()
  async findAll() {
    const rows = await this.getAllUsers.execute();
    return rows.map(UserResponseMapper.toDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const u = await this.getUser.execute(+id);
    return UserResponseMapper.toDto(u);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const updated = await this.updateUser.execute(+id, dto);
    return UserResponseMapper.toDto(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUser.execute(+id);
    return { deleted: true };
  }
}
