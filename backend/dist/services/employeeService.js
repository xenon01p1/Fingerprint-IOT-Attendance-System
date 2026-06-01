import { AppError } from "../middlewares/globalErrorMiddleware.js";
class EmployeeService {
    employeeRepo;
    constructor(employeeRepo) {
        this.employeeRepo = employeeRepo;
    }
    async getAllEmployeeService(page = 1, pageSize = 10) {
        try {
            // Validate pagination params
            const validPage = Math.max(1, page);
            const validPageSize = Math.max(1, Math.min(pageSize, 100)); // Cap at 100
            const skip = (validPage - 1) * validPageSize;
            const take = validPageSize;
            const employeesData = await this.employeeRepo.getAllEmployee(skip, take);
            const totalItems = await this.employeeRepo.getEmployeeCount();
            if (!Array.isArray(employeesData)) {
                throw new AppError("Failed to retrieve employee data", 500);
            }
            const totalPages = Math.ceil(totalItems / validPageSize);
            return {
                items: employeesData.map(employee => ({
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
                    updatedAt: employee.updatedAt,
                    fingerprintIndex: employee.fingerprints?.[0]?.fingerPrintIndex ?? null
                })),
                pagination: {
                    currentPage: validPage,
                    pageSize: validPageSize,
                    totalItems,
                    totalPages
                }
            };
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(error instanceof Error ? error.message : "Failed to retrieve employees", 500);
        }
    }
    async getEmployeeService(employeeId) {
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
            updatedAt: employeeData.updatedAt,
            fingerprintIndex: employeeData.fingerprints?.[0]?.fingerPrintIndex ?? null
        };
    }
    async createEmployeeService(data) {
        const createEmployeeResult = await this.employeeRepo.createEmployee(data);
        if (!createEmployeeResult) {
            throw new Error("Employee data not found");
        }
        return {
            id: createEmployeeResult.id
        };
    }
    async updateEmployeeService(employeeId, data) {
        const updateEmployeeResult = await this.employeeRepo.updateEmployee(employeeId, data);
        if (!updateEmployeeResult) {
            throw new Error("Employee data not found");
        }
        return {
            id: updateEmployeeResult.id
        };
    }
    async deleteEmployeeService(employeeId) {
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
