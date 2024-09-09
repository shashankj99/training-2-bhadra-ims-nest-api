import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [RolesModule, PrismaModule, OrganizationsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
