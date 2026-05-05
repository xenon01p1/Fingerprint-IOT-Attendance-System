import { PrismaClient, Admin } from "@prisma/client"; // Use Employee, not User

class AuthRepository {
    constructor(private prisma: PrismaClient) {};

    async findAdminByUsername(username: string): Promise<Admin | null> {
        return this.prisma.admin.findUnique({
            where: { username }
        });
    }

    async findAdminByRefreshToken(refreshToken: string): Promise<Admin | null> {
        return this.prisma.admin.findFirst({
            where: { refreshToken }
        })
    }

    async updateAdminRefreshToken(adminId: string, refreshToken: string): Promise<Admin> {
        return this.prisma.admin.update({
            where: { id: adminId },
            data: { refreshToken }
        });
    }
}

export default AuthRepository;