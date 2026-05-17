import express from "express";
import { PrismaClient } from "@prisma/client";
import EmployeeController from "../controllers/employeeController.js";
import EmployeeService from "../services/employeeService.js";
import EmployeeRepository from "../repositories/employeeRepo.js";

const employeeRoute = express.Router();
const prisma = new PrismaClient();

const employeeRepo = new EmployeeRepository(prisma);
const employeeService = new EmployeeService(employeeRepo);
const employeeController = new EmployeeController(employeeService);

employeeRoute.get('/', employeeController.getAllEmployeeController);
employeeRoute.get('/:employeeId', employeeController.getEmployeeController);
employeeRoute.post('/', employeeController.createEmployeeController);
employeeRoute.put('/:employeeId', employeeController.updateEmployeeController);
employeeRoute.delete('/:employeeId', employeeController.deleteEmployeeController);

export default employeeRoute;