import { PrismaClient, Employee } from "@prisma/client";

class EmployeeRepository {
    constructor(private prisma: PrismaClient) {}

    async getAllEmployee(skip?: number, take?: number): Promise<Employee[] | null> {
        if (skip !== undefined && take !== undefined) {
            return this.prisma.employee.findMany({
                skip,
                take
            });
        }
        return this.prisma.employee.findMany();
    }

    async getEmployeeCount(): Promise<number> {
        return this.prisma.employee.count();
    }

    async getEmployee(employeeId: string): Promise<Employee | null> {
        return this.prisma.employee.findFirst({
            where: { id: employeeId }
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