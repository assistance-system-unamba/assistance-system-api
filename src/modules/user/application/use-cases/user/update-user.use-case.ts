import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository';
import { UpdateUserDto } from '../../dto/input/user/update-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { PasswordService } from 'src/modules/auth/application/services/password.service';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    private readonly pwd: PasswordService,
  ) {}

  async execute(id: number, dto: UpdateUserDto): Promise<User> {
    const found = await this.userRepo.findById(id);
    if (!found) throw new NotFoundException('User not found');

    // 1) userName: normaliza y valida duplicado si cambió
    const incomingUserName = dto.userName?.trim();
    if (incomingUserName && incomingUserName !== found.getUserName()) {
      if (await this.userRepo.existsByUserName?.(incomingUserName)) {
        throw new BadRequestException('userName ya está en uso');
      }
    }

    // 2) password: hashea solo si llega en el DTO
    const passwordHash = dto.password
      ? await this.pwd.hash(dto.password)                 // nuevo hash
      : found.getPassword();                              // conserva el actual (ya hashed)

    // 3) recrea la entidad (inmutabilidad)
    const merged = User.create({
      userId: id,
      role: dto.role ?? found.getRole(),
      userName: incomingUserName ?? found.getUserName(),
      password: passwordHash,
      cardNumber: dto.cardNumber ?? found.getCardNumber(),
      participantId: found.getParticipantId(),            // no editable aquí
    });

    return this.userRepo.update(merged);
  }
}
