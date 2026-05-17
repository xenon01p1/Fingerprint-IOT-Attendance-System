import { PrismaClient, Employee } from "@prisma/client";

class EmployeeRepository {
    constructor(private prisma: PrismaClient) {}

    async getAllEmployee(): Promise<Employee[] | null> {
        return this.prisma.employee.findMany();
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