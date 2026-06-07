import { PrismaClient, Fingerprint } from "@prisma/client";

class FingerprintRepository {
    constructor(private prisma: PrismaClient) {}

    async getAllFingerprints(): Promise<Fingerprint[] | null> {
        return this.prisma.fingerprint.findMany();
    }

    async getFingerprint(fingerprintId: string): Promise<Fingerprint | null> {
        return this.prisma.fingerprint.findFirst({
            where: { id: fingerprintId }
        });
    }

    async findByDeviceAndIndex(
        deviceId: string,
        fingerprintIndex: number
    ): Promise<Fingerprint | null> {
        return this.prisma.fingerprint.findFirst({
            where: {
                deviceId,
                fingerPrintIndex: fingerprintIndex
            }
        });
    }

    async createFingerprint(
        data: {
            fingerPrintIndex: number,
            employeeId: string,
            deviceId: string
        }
    ): Promise<Fingerprint | null> {
        return this.prisma.fingerprint.create({ data });
    }

    async deleteFingerprint(fingerprintId: string): Promise<Fingerprint | null> {
        return this.prisma.fingerprint.delete({
            where: { id: fingerprintId }
        });
    }

    async getUsedIndexesByDevice(deviceId: string): Promise<number[]> {
        const fingerprints = await this.prisma.fingerprint.findMany({
            where: { deviceId },
            select: { fingerPrintIndex: true }
        });
        return fingerprints.map(fp => fp.fingerPrintIndex);
    }
}

export default FingerprintRepository;