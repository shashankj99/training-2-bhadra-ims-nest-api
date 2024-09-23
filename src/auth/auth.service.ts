import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    {
                        email: loginDto.username,
                    },
                    {
                        mobile: loginDto.username,
                    },
                ],
            },
            include: {
                role: true,
            },
        });

        if (!user) {
            throw new NotFoundException("Unable to find the user");
        }

        if (!await compare(loginDto.password, user.password)) {
            throw new UnauthorizedException("Invalid Credentials!");
        }

        const token = await this.jwtService.signAsync(user);

        return {
            token,
        }
    }

    async register(registerDto: RegisterDto) {
        const userService = new UsersService(this.prismaService);
        const user = await userService.create(registerDto);
        const token = await this.jwtService.signAsync(user);
        return {
            token,
        }
    }
}
