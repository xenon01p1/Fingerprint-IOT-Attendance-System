class FingerprintRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllFingerprints() {
        return this.prisma.fingerprint.findMany();
    }
    async getFingerprint(fingerprintId) {
        return this.prisma.fingerprint.findFirst({
            where: { id: fingerprintId }
        });
    }
    async findByDeviceAndIndex(deviceId, fingerprintIndex) {
        return this.prisma.fingerprint.findFirst({
            where: {
                deviceId,
                fingerPrintIndex: fingerprintIndex
            }
        });
    }
    async createFingerprint(data) {
        return this.prisma.fingerprint.create({ data });
    }
    async deleteFingerprint(fingerprintId) {
        return this.prisma.fingerprint.delete({
            where: { id: fingerprintId }
        });
    }
}
export default FingerprintRepository;
