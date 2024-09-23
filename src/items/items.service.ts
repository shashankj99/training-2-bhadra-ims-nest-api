import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { capitalizeFirstLetterOfEachWordInAPhrase } from 'src/helpers/capitalize';

@Injectable()
export class ItemsService {
  constructor(private prismaService: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    createItemDto.name = capitalizeFirstLetterOfEachWordInAPhrase(createItemDto.name);

    return this.prismaService.item.upsert({
      where: { name: createItemDto.name },
      update: {
        item_organizations: {
          create: {
            organization_id: createItemDto.organization_id,
          }
        },
      },
      create: {
        ...createItemDto,
        item_organizations: {
          create: {
            organization_id: createItemDto.organization_id,
          }
        }
      }
    });

    return this.prismaService.$transaction(async (tx) => {
      const item = await tx.item.upsert({
        where: { name: createItemDto.name },
        update: {},
        create: createItemDto,
      });

      await tx.itemOrganization.create({
        data: {
          item_id: item.id,
          organization_id: createItemDto.organization_id,
        }
      })
    });
  }

  findAll() {
    return `This action returns all items`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
