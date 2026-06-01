import AdminService from "../services/adminService.js";
import type { Request, Response, NextFunction } from "express";
import {
    createAdminInput,
    updateAdminInput,
    allAdminResponse,
    singleAdminResponse,
    adminIdResponse
} from "../schema/adminSchema.js";

class AdminController {
    constructor(private adminService: AdminService) {}

    // Request<Params, ResponseBody, RequestBody, Query>
    getAllAdminController = async (
        req: Request<{ }, allAdminResponse, {}>,
        res: Response<allAdminResponse>,
        next: NextFunction
    ) => {
        try {
            const pageInt = parseInt(req.query.page as string) || 1;
            const pageSizeInt = parseInt(req.query.pageSize as string) || 10;

            const result = await this.adminService.getAllAdminService(pageInt, pageSizeInt);

            res.status(200).json({
                status: true,
                message: "Admins retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    getAdminController = async (
        req: Request<{ adminId: string }, singleAdminResponse, {}>,
        res: Response<singleAdminResponse>,
        next: NextFunction
    ) => {
        try {
            const { adminId } = req.params;
            const admin = await this.adminService.getAdminService(adminId);

            res.status(200).json({
                status: true,
                message: "Admin retrieved successfully",
                data: admin
            });
        } catch (error) {
            next(error);
        }
    };

    createAdminController = async (
        req: Request<{}, adminIdResponse, createAdminInput>,
        res: Response<adminIdResponse>,
        next: NextFunction
    ) => {
        try {
            const { username, password, email, phoneNumber } = req.body;
            const newAdmin = await this.adminService.createAdminService(
                username,
                password,
                email,
                phoneNumber
            );

            res.status(201).json({
                status: true,
                message: "Admin created successfully",
                data: newAdmin
            });
        } catch (error) {
            next(error);
        }
    };

    updateAdminController = async (
        req: Request<{ adminId: string }, adminIdResponse, updateAdminInput>,
        res: Response<adminIdResponse>,
        next: NextFunction
    ) => {
        try {
            const { adminId } = req.params;
            const updatedAdmin = await this.adminService.updateAdminService(adminId, req.body);

            res.status(200).json({
                status: true,
                message: "Admin updated successfully",
                data: updatedAdmin
            });
        } catch (error) {
            next(error);
        }
    };

    deleteAdminController = async (
        req: Request<{ adminId: string }, adminIdResponse, {}>,
        res: Response<adminIdResponse>,
        next: NextFunction
    ) => {
        try {
            const { adminId } = req.params;
            const deletedAdmin = await this.adminService.deleteAdminService(adminId);

            res.status(200).json({
                status: true,
                message: "Admin deleted successfully",
                data: deletedAdmin
            });
        } catch (error) {
            next(error);
        }
    };
}

export default AdminController;