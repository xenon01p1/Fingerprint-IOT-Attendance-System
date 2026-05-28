import { AppError } from "../middlewares/globalErrorMiddleware.js";
class AdminService {
    adminRepo;
    constructor(adminRepo) {
        this.adminRepo = adminRepo;
    }
    async getAllAdminService(page = 1, pageSize = 10) {
        try {
            // Validate pagination params
            const validPage = Math.max(1, page);
            const validPageSize = Math.max(1, Math.min(pageSize, 100)); // Cap at 100
            const skip = (validPage - 1) * validPageSize;
            const take = validPageSize;
            const adminsData = await this.adminRepo.getAllAdmin(skip, take);
            const totalItems = await this.adminRepo.getAdminCount();
            if (!Array.isArray(adminsData)) {
                throw new AppError("Failed to retrieve admin data", 500);
            }
            const totalPages = Math.ceil(totalItems / validPageSize);
            return {
                items: adminsData.map(admin => ({
                    id: admin.id,
                    username: admin.username,
                    email: admin.email,
                    phoneNumber: admin.phoneNumber,
                    createdAt: admin.createdAt,
                    updatedAt: admin.updatedAt
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
            throw new AppError(error instanceof Error ? error.message : "Failed to retrieve admins", 500);
        }
    }
    async getAdminService(adminId) {
        const adminData = await this.adminRepo.getAdmin(adminId);
        if (!adminData) {
            throw new Error("Admin data not found");
        }
        return {
            id: adminData.id,
            username: adminData.username,
            email: adminData.email,
            phoneNumber: adminData.phoneNumber,
            createdAt: adminData.createdAt,
            updatedAt: adminData.updatedAt
        };
    }
    async createAdminService(username, password, email, phoneNumber) {
        const createAdminResult = await this.adminRepo.createAdmin(username, password, email, phoneNumber);
        if (!createAdminResult) {
            throw new Error("Admin data not found");
        }
        return {
            id: createAdminResult.id
        };
    }
    async updateAdminService(adminId, data) {
        const updateAdminResult = await this.adminRepo.updateAdmin(adminId, data);
        if (!updateAdminResult) {
            throw new Error("Admin data not found");
        }
        return {
            id: updateAdminResult.id
        };
    }
    async deleteAdminService(adminId) {
        const adminDelete = await this.adminRepo.deleteAdmin(adminId);
        if (!adminDelete) {
            throw new Error("delete unsuccessful");
        }
        return {
            id: adminDelete.id
        };
    }
}
export default AdminService;
