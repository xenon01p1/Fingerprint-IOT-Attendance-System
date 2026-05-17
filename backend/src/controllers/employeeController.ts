import EmployeeService from "../services/employeeService.js";
import type { Request, Response, NextFunction } from "express";
import {
    createEmployeeInput,
    updateEmployeeInput,
    allEmployeeResponse,
    singleEmployeeResponse,
    employeeIdResponse
} from "../schema/employeeSchema.js";

class EmployeeController {
    constructor(private employeeService: EmployeeService) {}

    getAllEmployeeController = async (
        req: Request<{}, allEmployeeResponse, {}>,
        res: Response<allEmployeeResponse>,
        next: NextFunction
    ) => {
        try {
            const employees = await this.employeeService.getAllEmployeeService();

            res.status(200).json({
                status: true,
                message: "Employees retrieved successfully",
                data: employees
            });
        } catch (error) {
            next(error);
        }
    };

    getEmployeeController = async (
        req: Request<{ employeeId: string }, singleEmployeeResponse, {}>,
        res: Response<singleEmployeeResponse>,
        next: NextFunction
    ) => {
        try {
            const { employeeId } = req.params;
            const employee = await this.employeeService.getEmployeeService(employeeId);

            res.status(200).json({
                status: true,
                message: "Employee retrieved successfully",
                data: employee
            });
        } catch (error) {
            next(error);
        }
    };

    createEmployeeController = async (
        req: Request<{}, employeeIdResponse, createEmployeeInput>,
        res: Response<employeeIdResponse>,
        next: NextFunction
    ) => {
        try {
            const newEmployee = await this.employeeService.createEmployeeService(req.body);

            res.status(201).json({
                status: true,
                message: "Employee created successfully",
                data: newEmployee
            });
        } catch (error) {
            next(error);
        }
    };

    updateEmployeeController = async (
        req: Request<{ employeeId: string }, employeeIdResponse, updateEmployeeInput>,
        res: Response<employeeIdResponse>,
        next: NextFunction
    ) => {
        try {
            const { employeeId } = req.params;
            const updatedEmployee = await this.employeeService.updateEmployeeService(employeeId, req.body);

            res.status(200).json({
                status: true,
                message: "Employee updated successfully",
                data: updatedEmployee
            });
        } catch (error) {
            next(error);
        }
    };

    deleteEmployeeController = async (
        req: Request<{ employeeId: string }, employeeIdResponse, {}>,
        res: Response<employeeIdResponse>,
        next: NextFunction
    ) => {
        try {
            const { employeeId } = req.params;
            const deletedEmployee = await this.employeeService.deleteEmployeeService(employeeId);

            res.status(200).json({
                status: true,
                message: "Employee deleted successfully",
                data: deletedEmployee
            });
        } catch (error) {
            next(error);
        }
    };
}

export default EmployeeController;