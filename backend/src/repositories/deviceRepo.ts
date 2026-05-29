import { PrismaClient, Device } from "@prisma/client";

class DeviceRepository {
    constructor(private prisma: PrismaClient) {}

    async getAllDevices(skip?: number, take?: number): Promise<Device[] | null> {
        if (skip !== undefined && take !== undefined) {
            return this.prisma.device.findMany({
                skip,
                take
            });
        }
        return this.prisma.device.findMany();
    }

    async createDevice(
        data: {
            name: string,
            address: string,
            location: string,
            companyId: string
        }
    ): Promise<Device | null> {
        return this.prisma.device.create({ data });
    }

    async updateDevice(
        deviceId: string,
        data: {
            name: string,
            address: string,
            location: string,
            companyId: string
        }
    ): Promise<Device | null> {
        return this.prisma.device.update({
            where: { id: deviceId },
            data
        });
    }

    async deleteDevice(deviceId: string): Promise<Device | null> {
        return this.prisma.device.delete({
            where: { id: deviceId }
        });
    }
}