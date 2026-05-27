import AdminRepository from "../repositories/adminRepo.js";

class AdminService {
    constructor(private adminRepo: AdminRepository) {}

    async getAllAdminService(page: number = 1, pageSize: number = 10) {
        // Validate pagination params
        const validPage = Math.max(1, page);
        const validPageSize = Math.max(1, Math.min(pageSize, 100)); // Cap at 100
        
        const skip = (validPage - 1) * validPageSize;
        const take = validPageSize;

        const adminsData = await this.adminRepo.getAllAdmin(skip, take);
        const totalItems = await this.adminRepo.getAdminCount();
        
        if (!adminsData) {
            throw new Error("Admin data not found");
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
    
    async getAdminService(adminId: string) {
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

    async createAdminService(
        username: string,
        password: string,
        email: string,
        phoneNumber: string
    ) {
        const createAdminResult = await this.adminRepo.createAdmin(username, password, email, phoneNumber);
        
        if (!createAdminResult) {
            throw new Error("Admin data not found");
        }  

        return {
            id: createAdminResult.id
        };
    }

    async updateAdminService(
        adminId: string,
        data: {
            username?: string;
            password?: string;
            email?: string;
            phoneNumber?: string;
        }
    ) {
        const updateAdminResult = await this.adminRepo.updateAdmin(adminId, data);
        
        if (!updateAdminResult) {
            throw new Error("Admin data not found");
        }  

        return {
            id: updateAdminResult.id
        };
    }

    async deleteAdminService(adminId: string) {
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