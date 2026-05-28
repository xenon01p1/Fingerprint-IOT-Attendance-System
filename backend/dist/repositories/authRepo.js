class AuthRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    ;
    async findAdminByUsername(username) {
        return this.prisma.admin.findUnique({
            where: { username }
        });
    }
    async findAdminByRefreshToken(refreshToken) {
        return this.prisma.admin.findFirst({
            where: { refreshToken }
        });
    }
    async updateAdminRefreshToken(adminId, refreshToken) {
        return this.prisma.admin.update({
            where: { id: adminId },
            data: { refreshToken }
        });
    }
}
export default AuthRepository;
