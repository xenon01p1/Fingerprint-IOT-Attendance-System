import EmployeeRepository from "../repositories/employeeRepo.js";
import { createEmployeeInput, updateEmployeeInput } from "../schema/employeeSchema.js";

class EmployeeService {
    constructor(private employeeRepo: EmployeeRepository) {}

    async getAllEmployeeService() {
        const employeesData = await this.employeeRepo.getAllEmployee();

        if (!employeesData || employeesData.length === 0) {
            throw new Error("Employee data not found");
        }

        return employeesData.map(employee => ({
            id: employee.id,
            employeeNumber: employee.employeeNumber,
            fullname: employee.fullname,
            username: employee.username,
            email: employee.email,
            phoneNumber: employee.phoneNumber,
            role: employee.role,
            employeeStatus: employee.employeeStatus,
            status: employee.status,
            companyId: employee.companyId,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt
        }));
    }

    async getEmployeeService(employeeId: string) {
        const employeeData = await this.employeeRepo.getEmployee(employeeId);

        if (!employeeData) {
            throw new Error("Employee data not found");
        }

        return {
            id: employeeData.id,
            employeeNumber: employeeData.employeeNumber,
            fullname: employeeData.fullname,
            username: employeeData.username,
            email: employeeData.email,
            phoneNumber: employeeData.phoneNumber,
            role: employeeData.role,
            employeeStatus: employeeData.employeeStatus,
            status: employeeData.status,
            companyId: employeeData.companyId,
            createdAt: employeeData.createdAt,
            updatedAt: employeeData.updatedAt
        };
    }

    async createEmployeeService(data: createEmployeeInput) {
        const createEmployeeResult = await this.employeeRepo.createEmployee(data);

        if (!createEmployeeResult) {
            throw new Error("Employee data not found");
        }

        return {
            id: createEmployeeResult.id
        };
    }

    async updateEmployeeService(employeeId: string, data: updateEmployeeInput) {
        const updateEmployeeResult = await this.employeeRepo.updateEmployee(employeeId, data);

        if (!updateEmployeeResult) {
            throw new Error("Employee data not found");
        }

        return {
            id: updateEmployeeResult.id
        };
    }

    async deleteEmployeeService(employeeId: string) {
        const employeeDelete = await this.employeeRepo.deleteEmployee(employeeId);

        if (!employeeDelete) {
            throw new Error("delete unsuccessful");
        }

        return {
            id: employeeDelete.id
        };
    }
}

export default EmployeeService;