import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { IsEmailExistConstraint } from './custom-validator/existing-email/existing-email-constraint';
import { PrismaService } from './prisma.service';
import { IsUniqueConstraint } from './custom-validator/is-unique/is-unique-constraint';
import { ManyToManyConstraint } from './custom-validator/many-to-many/many-to-many-constraint';

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot({isGlobal: true})],
  controllers: [],
  providers: [IsEmailExistConstraint, PrismaService, IsUniqueConstraint, ManyToManyConstraint],
})
export class AppModule {}
