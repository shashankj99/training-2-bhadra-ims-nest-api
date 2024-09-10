import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { capitalizeFirstLetterOfEachWordInAPhrase } from 'src/helpers/capitalize';
import { RolesService } from 'src/roles/roles.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const roleService = new RolesService(this.prismaService);
    const organizationService = new OrganizationsService(this.prismaService);

    await roleService.findOne(createUserDto.role_id);
    await organizationService.findOne(createUserDto.organization_id);

    createUserDto.name = capitalizeFirstLetterOfEachWordInAPhrase(createUserDto.name);

    if (await this.checkIfEmailExist(createUserDto.email)) {
      throw new BadRequestException("This email has alredy been taken");
    }

    if (await this.checkIfMobileExist(createUserDto.mobile)) {
      throw new BadRequestException("This mobile has alredy been taken");
    }

    createUserDto.password = await hash(createUserDto.password, 10);

    return this.prismaService.user.create({ data: createUserDto });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async checkIfEmailExist(email: string, id?: number): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { email, }
    });

    if (id) {
      return user ? user.id === id : true;
    }

    return !!user;
  }

  private async checkIfMobileExist(mobile: string, id?: number): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { mobile, }
    });

    if (id) {
      return user ? user.id === id : true;
    }

    return !!user;
  }
}
