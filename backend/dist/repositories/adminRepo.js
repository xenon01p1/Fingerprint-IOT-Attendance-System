class AdminRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    ;
    async getAllAdmin(skip, take) {
        if (skip !== undefined && take !== undefined) {
            return this.prisma.admin.findMany({
                skip,
                take
            });
        }
        return this.prisma.admin.findMany();
    }
    async getAdminCount() {
        return this.prisma.admin.count();
    }
    async getAdmin(adminId) {
        return this.prisma.admin.findFirst({
            where: { id: adminId }
        });
    }
    async createAdmin(username, password, email, phoneNumber) {
        return this.prisma.admin.create({
            data: {
                username,
                password,
                email,
                phoneNumber
            }
        });
    }
    async updateAdmin(adminId, data) {
        return this.prisma.admin.update({
            where: { id: adminId },
            data: data
        });
    }
    async deleteAdmin(adminId) {
        return this.prisma.admin.delete({
            where: { id: adminId }
        });
    }
}
export default AdminRepository;
