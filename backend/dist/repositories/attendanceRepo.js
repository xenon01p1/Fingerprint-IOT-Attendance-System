class AttendanceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllAttendance(skip, take) {
        if (skip !== undefined && take !== undefined) {
            return this.prisma.attendance.findMany({
                skip,
                take,
                include: {
                    employee: {
                        select: {
                            id: true,
                            employeeNumber: true,
                            fullname: true,
                            username: true,
                            email: true
                        }
                    },
                    device: {
                        select: {
                            id: true,
                            name: true,
                            location: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        return this.prisma.attendance.findMany({
            include: {
                employee: {
                    select: {
                        id: true,
                        employeeNumber: true,
                        fullname: true,
                        username: true,
                        email: true
                    }
                },
                device: {
                    select: {
                        id: true,
                        name: true,
                        location: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async getAttendanceCount() {
        return this.prisma.attendance.count();
    }
    async getAttendance(attendanceId) {
        return this.prisma.attendance.findFirst({
            where: { id: attendanceId },
            include: {
                employee: {
                    select: {
                        id: true,
                        employeeNumber: true,
                        fullname: true,
                        username: true,
                        email: true
                    }
                },
                device: {
                    select: {
                        id: true,
                        name: true,
                        location: true
                    }
                }
            }
        });
    }
    async createAttendance(data) {
        return this.prisma.attendance.create({
            data: data,
            include: {
                employee: {
                    select: {
                        id: true,
                        employeeNumber: true,
                        fullname: true,
                        username: true,
                        email: true
                    }
                },
                device: {
                    select: {
                        id: true,
                        name: true,
                        location: true
                    }
                }
            }
        });
    }
}
export default AttendanceRepository;
