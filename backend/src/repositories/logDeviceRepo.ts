import { PrismaClient, LogDevice } from "@prisma/client";

class LogDeviceRepository {
    constructor(private prisma: PrismaClient) {}

    async getAllLogDevice(skip?: number, take?: number): Promise<(LogDevice & { fingerprint: any })[] | null> {
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

    async getLogDeviceCount(): Promise<number> {
        return this.prisma.logDevice.count();
    }

    async getLogDevice(logDeviceId: string): Promise<(LogDevice & { fingerprint: any }) | null> {
        return this.prisma.logDevice.findFirst({
            where: { id: logDeviceId },
            include: {
                fingerprint: true
            }
        });
    }

    async createLogDevice(data: {
        type: "register" | "finishRegister" | "checkIn" | "checkOut" | "delete";
        fingerprintId: string;
        deviceId: string;
    }): Promise<(LogDevice & { fingerprint: any }) | null> {
        return this.prisma.logDevice.create({
            data: data,
            include: {
                fingerprint: true
            }
        });
    }
}

export default LogDeviceRepository;
