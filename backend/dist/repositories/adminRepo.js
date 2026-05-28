class AdminRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    ;
    async getAllAdmin(skip, take) {
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
    async getAdminCount() {
        return this.prisma.admin.count({
            where: { isDeleted: false }
        });
    }
    async getAdmin(adminId) {
        return this.prisma.admin.findFirst({
            where: { id: adminId, isDeleted: false }
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
        return this.prisma.admin.update({
            where: { id: adminId },
            data: { isDeleted: true }
        });
    }
}
export default AdminRepository;
