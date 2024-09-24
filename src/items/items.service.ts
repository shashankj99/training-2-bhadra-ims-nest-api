import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { capitalizeFirstLetterOfEachWordInAPhrase } from 'src/helpers/capitalize';
import { Item } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private prismaService: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    createItemDto.name = capitalizeFirstLetterOfEachWordInAPhrase(createItemDto.name);

    let item: Item;

    item = await this.prismaService.item.findUnique({
      where: { name: createItemDto.name, },
    });

    if(!item) {
      item = await this.prismaService.item.create({
        data: {
          name: createItemDto.name,
          quantity: createItemDto.quantity,
          price: createItemDto.price,
          ...(createItemDto.description && {
            description: createItemDto.description,
          }),
          ...(createItemDto.discount && {
            discount: createItemDto.discount,
          }),
          ...(createItemDto.discount_type && {
            discount_type: createItemDto.discount_type,
          }),
          ...(createItemDto.tax && {
            tax: createItemDto.tax,
          }),
        },
      });
    }

    await this.prismaService.itemOrganization.create({
      data: {
        item_id: item.id,
        organization_id: createItemDto.organization_id,
      },
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
