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
}

export default FingerprintRepository;