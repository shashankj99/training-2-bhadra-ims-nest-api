import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { capitalizeFirstLetterOfEachWordInAPhrase } from 'src/helpers/capitalize';

@Injectable()
export class OrganizationsService {
  constructor(private prismaService: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    createOrganizationDto.name = capitalizeFirstLetterOfEachWordInAPhrase(createOrganizationDto.name);

    if (createOrganizationDto.address) {
      createOrganizationDto.address = capitalizeFirstLetterOfEachWordInAPhrase(createOrganizationDto.address);
    }

    if (await this.checkIfOrganizationExist(createOrganizationDto.name)) {
      throw new BadRequestException(`Organization ${createOrganizationDto.name} has already been taken`);
    }

    return this.prismaService.organization.create({ data: createOrganizationDto });
  }

  async findAll() {
    return this.prismaService.organization.findMany();
  }

  async findOne(id: number) {
    return this.getOrganizationById(id);
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    await this.getOrganizationById(id);

    updateOrganizationDto.name = capitalizeFirstLetterOfEachWordInAPhrase(updateOrganizationDto.name);

    if (updateOrganizationDto.address) {
      updateOrganizationDto.address = capitalizeFirstLetterOfEachWordInAPhrase(updateOrganizationDto.address);
    }

    if (!await this.checkIfOrganizationExist(updateOrganizationDto.name, id)) {
      throw new BadRequestException(`Organization ${updateOrganizationDto.name} has already been taken`);
    }

    return this.prismaService.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });
  }

  async remove(id: number) {
    await this.getOrganizationById(id);
    return this.prismaService.organization.delete({ where: { id } });
  }

  private async checkIfOrganizationExist(name: string, id?: number): Promise<boolean> {
    const organization = await this.prismaService.organization.findUnique({
      where: { name, }
    });

    if (id) {
      return organization ? organization.id === id : true;
    }

    return !!organization;
  }

  private async getOrganizationById(id: number) {
    const organization = await this.prismaService.organization.findFirst({ where: { id } });

    if (!organization) {
      throw new NotFoundException(`Organization with id ${id} does not exist`);
    }

    return organization;
  }
}
