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
