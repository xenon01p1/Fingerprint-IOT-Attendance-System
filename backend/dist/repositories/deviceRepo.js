class DeviceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllDevices(skip, take) {
        if (skip !== undefined && take !== undefined) {
            return this.prisma.device.findMany({
                skip,
                take
            });
        }
        return this.prisma.device.findMany();
    }
    async getDeviceCount() {
        return this.prisma.device.count();
    }
    async createDevice(data) {
        return this.prisma.device.create({ data });
    }
    async updateDevice(deviceId, data) {
        return this.prisma.device.update({
            where: { id: deviceId },
            data
        });
    }
    async deleteDevice(deviceId) {
        return this.prisma.device.delete({
            where: { id: deviceId }
        });
    }
}
export default DeviceRepository;
