class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getAllAdminController = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const result = await this.adminService.getAllAdminService(page, pageSize);
            res.status(200).json({
                status: true,
                message: "Admins retrieved successfully",
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    getAdminController = async (req, res, next) => {
        try {
            const { adminId } = req.params;
            const admin = await this.adminService.getAdminService(adminId);
            res.status(200).json({
                status: true,
                message: "Admin retrieved successfully",
                data: admin
            });
        }
        catch (error) {
            next(error);
        }
    };
    createAdminController = async (req, res, next) => {
        try {
            const { username, password, email, phoneNumber } = req.body;
            const newAdmin = await this.adminService.createAdminService(username, password, email, phoneNumber);
            res.status(201).json({
                status: true,
                message: "Admin created successfully",
                data: newAdmin
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateAdminController = async (req, res, next) => {
        try {
            const { adminId } = req.params;
            const updatedAdmin = await this.adminService.updateAdminService(adminId, req.body);
            res.status(200).json({
                status: true,
                message: "Admin updated successfully",
                data: updatedAdmin
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteAdminController = async (req, res, next) => {
        try {
            const { adminId } = req.params;
            const deletedAdmin = await this.adminService.deleteAdminService(adminId);
            res.status(200).json({
                status: true,
                message: "Admin deleted successfully",
                data: deletedAdmin
            });
        }
        catch (error) {
            next(error);
        }
    };
}
export default AdminController;
