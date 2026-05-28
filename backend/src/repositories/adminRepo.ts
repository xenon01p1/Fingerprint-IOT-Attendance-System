import { PrismaClient, Admin } from "@prisma/client"; // Use Employee, not User

class AdminRepository {
    constructor(private prisma: PrismaClient) {};

    async getAllAdmin(skip?: number, take?: number): Promise<Admin[] | null>  {
        if (skip !== undefined && take !== undefined) {
            return this.prisma.admin.findMany({
                where: { isDeleted: false },
                skip,
                take
            });
        }
        return this.prisma.admin.findMany({
            where: { isDeleted: false }
        });
    }

    async getAdminCount(): Promise<number> {
        return this.prisma.admin.count({
            where: { isDeleted: false }
        });
    }

    async getAdmin(adminId: string): Promise<Admin | null> {
        return this.prisma.admin.findFirst({
            where: { id: adminId, isDeleted: false }
        });
    }

    async createAdmin(
        username: string,
        password: string,
        email: string,
        phoneNumber: string
    ): Promise<Admin | null> {
        return this.prisma.admin.create({
            data: {
                username,
                password,
                email,
                phoneNumber
            }
        })
    }

    async updateAdmin(
        adminId: string,
        data: {
            username?: string;
            password?: string;
            email?: string;
            phoneNumber?: string;
        }
    ): Promise<Admin | null>  {
        return this.prisma.admin.update({
            where: { id: adminId },
            data: data 
        });
    }

    async deleteAdmin(adminId: string): Promise<Admin | null> {
        return this.prisma.admin.update({
            where: { id: adminId },
            data: { isDeleted: true }
        });
    }
}

export default AdminRepository;