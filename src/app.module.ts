import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { EventModule } from './modules/event/event.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    EventModule,
    AttendanceModule,    
  ]
})
export class AppModule {}
