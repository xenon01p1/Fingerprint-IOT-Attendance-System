class LogDeviceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllLogDevice(skip, take) {
        if (skip !== undefined && take !== undefined) {
            return this.prisma.logDevice.findMany({
                skip,
                take,
                include: {
                    fingerprint: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        return this.prisma.logDevice.findMany({
            include: {
                fingerprint: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async getLogDeviceCount() {
        return this.prisma.logDevice.count();
    }
    async getLogDevice(logDeviceId) {
        return this.prisma.logDevice.findFirst({
            where: { id: logDeviceId },
            include: {
                fingerprint: true
            }
        });
    }
    async createLogDevice(data) {
        return this.prisma.logDevice.create({
            data: {
                type: data.type,
                fingerprintId: data.fingerprintId
            },
            include: {
                fingerprint: true
            }
        });
    }
}
export default LogDeviceRepository;
