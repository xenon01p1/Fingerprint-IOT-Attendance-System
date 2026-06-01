import { PrismaClient, Employee } from "@prisma/client";

class EmployeeRepository {
    constructor(private prisma: PrismaClient) {}

    async getAllEmployee(skip?: number, take?: number) {
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

    async getEmployeeCount(): Promise<number> {
        return this.prisma.employee.count();
    }

    async getEmployee(employeeId: string) {
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

    async createEmployee(data: {
        employeeNumber: number;
        fullname: string;
        username: string;
        password: string;
        email: string;
        phoneNumber: string;
        companyId: string;
        role?: "regular" | "supervisor";
        employeeStatus?: "active" | "onLeave" | "resigned";
        status?: "active" | "banned" | "deleted";
    }): Promise<Employee | null> {
        return this.prisma.employee.create({
            data: data
        });
    }

    async updateEmployee(
        employeeId: string,
        data: {
            employeeNumber?: number;
            fullname?: string;
            username?: string;
            password?: string;
            email?: string;
            phoneNumber?: string;
            companyId?: string;
            role?: "regular" | "supervisor";
            employeeStatus?: "active" | "onLeave" | "resigned";
            status?: "active" | "banned" | "deleted";
        }
    ): Promise<Employee | null> {
        return this.prisma.employee.update({
            where: { id: employeeId },
            data: data
        });
    }

    async deleteEmployee(employeeId: string): Promise<Employee | null> {
        return this.prisma.employee.delete({
            where: { id: employeeId }
        });
    }
}

export default EmployeeRepository;