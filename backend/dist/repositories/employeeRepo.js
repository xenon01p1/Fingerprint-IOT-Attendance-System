class EmployeeRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllEmployee(skip, take) {
        if (skip !== undefined && take !== undefined) {
            return this.prisma.employee.findMany({
                skip,
                take,
                include: {
                    fingerprints: {
                        select: {
                            fingerPrintIndex: true
                        },
                        take: 1,
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }
            });
        }
        return this.prisma.employee.findMany({
            include: {
                fingerprints: {
                    select: {
                        fingerPrintIndex: true
                    },
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
    }
    async getEmployeeCount() {
        return this.prisma.employee.count();
    }
    async getEmployee(employeeId) {
        return this.prisma.employee.findFirst({
            where: { id: employeeId },
            include: {
                fingerprints: {
                    select: {
                        fingerPrintIndex: true
                    },
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
    }
    async createEmployee(data) {
        return this.prisma.employee.create({
            data: data
        });
    }
    async updateEmployee(employeeId, data) {
        return this.prisma.employee.update({
            where: { id: employeeId },
            data: data
        });
    }
    async deleteEmployee(employeeId) {
        return this.prisma.employee.delete({
            where: { id: employeeId }
        });
    }
}
export default EmployeeRepository;
