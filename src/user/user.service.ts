import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}
    async getUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                lastName: true,
                firstName: true,
                email: true,
            }
        });
        return users;
    }

    async getUser({ userId } : { userId: string}) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                lastName: true,
                firstName: true,
                email: true,
            }
        });
        return user;
    }

    async getUserByEmail({ email } : { email: string}) {
        try {
            const user = await this.prisma.user.findUnique({
              where: { email },
              include: {
                roles: {
                  select: { role: true },
                },
              },
            });
            return user;
          } catch {
            return null;
          }
    }
}
