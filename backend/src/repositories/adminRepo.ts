import { PrismaClient, Admin } from "@prisma/client"; // Use Employee, not User

class AdminRepository {
    constructor(private prisma: PrismaClient) {};

    async getAllAdmin(): Promise<Admin[] | null>  {
        return this.prisma.admin.findMany();
    }

    async getAdmin(adminId: string): Promise<Admin | null> {
        return this.prisma.admin.findFirst({
            where: { id: adminId }
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
        return this.prisma.admin.delete({
             where: { id: adminId }
        });
    }
}

export default AdminRepository;