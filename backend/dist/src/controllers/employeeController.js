class EmployeeController {
    employeeService;
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    getAllEmployeeController = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const result = await this.employeeService.getAllEmployeeService(page, pageSize);
            res.status(200).json({
                status: true,
                message: "Employees retrieved successfully",
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    getEmployeeController = async (req, res, next) => {
        try {
            const { employeeId } = req.params;
            const employee = await this.employeeService.getEmployeeService(employeeId);
            res.status(200).json({
                status: true,
                message: "Employee retrieved successfully",
                data: employee
            });
        }
        catch (error) {
            next(error);
        }
    };
    createEmployeeController = async (req, res, next) => {
        try {
            const newEmployee = await this.employeeService.createEmployeeService(req.body);
            res.status(201).json({
                status: true,
                message: "Employee created successfully",
                data: newEmployee
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateEmployeeController = async (req, res, next) => {
        try {
            const { employeeId } = req.params;
            const updatedEmployee = await this.employeeService.updateEmployeeService(employeeId, req.body);
            res.status(200).json({
                status: true,
                message: "Employee updated successfully",
                data: updatedEmployee
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteEmployeeController = async (req, res, next) => {
        try {
            const { employeeId } = req.params;
            const deletedEmployee = await this.employeeService.deleteEmployeeService(employeeId);
            res.status(200).json({
                status: true,
                message: "Employee deleted successfully",
                data: deletedEmployee
            });
        }
        catch (error) {
            next(error);
        }
    };
}
export default EmployeeController;
