import { connectDB } from '../config/index.js';
import User from '../models/user/userModel.js';
import Employee from '../models/employee/employeeModel.js';
import Admin from '../models/admin/adminModel.js';
import { ROLE } from '../utils/constants/constants.js';
import chalk from 'chalk';

const employeesData = [
    { name: 'John Doe', email: 'john@spanemployee.com', code: 'EMP001' },
    { name: 'Jane Smith', email: 'jane@spanemployee.com', code: 'EMP002' },
    { name: 'Mike Johnson', email: 'mike@spanemployee.com', code: 'EMP003' },
    { name: 'Sarah Williams', email: 'sarah@spanemployee.com', code: 'EMP004' },
    { name: 'Chris Brown', email: 'chris@spanemployee.com', code: 'EMP005' },
    { name: 'Emily Davis', email: 'emily@spanemployee.com', code: 'EMP006' },
    { name: 'David Miller', email: 'david@spanemployee.com', code: 'EMP007' },
    { name: 'Jessica Taylor', email: 'jessica@spanemployee.com', code: 'EMP008' },
    { name: 'Robert Wilson', email: 'robert@spanemployee.com', code: 'EMP009' },
    { name: 'Linda Moore', email: 'linda@spanemployee.com', code: 'EMP010' },
];

const seedEmployees = async () => {
    try {
        await connectDB();

        console.log(chalk.blue('Cleaning up existing Employees...'));
        const existingEmployees = await User.find({ Role: ROLE.EMPLOYEE });
        const userIds = existingEmployees.map(u => u.User_Id);
        await Employee.deleteMany({ User_Id: { $in: userIds } });
        await User.deleteMany({ User_Id: { $in: userIds } });

        console.log(chalk.blue('Starting Employee Seeding...'));

        // Find an admin to associate these employees with
        const admin = await Admin.findOne();
        if (!admin) {
            console.error(chalk.red('No Admin found. Please seed Admins first.'));
            process.exit(1);
        }

        for (const emp of employeesData) {
            let user = await User.findOne({ Email: emp.email });

            if (user) {
                console.log(chalk.yellow(`Employee ${emp.name} already exists. Skipping...`));
            } else {
                console.log(chalk.green(`Creating Employee: ${emp.name}...`));
                user = new User({
                    Name: emp.name,
                    Email: emp.email,
                    Password: 'Employee@123',
                    Role: ROLE.EMPLOYEE,
                });
                await user.save();

                const employeeEntry = new Employee({
                    User_Id: user.User_Id,
                    Admin_Id: admin.Admin_Id,
                    Employee_Code: emp.code,
                    Department: 'Engineering',
                    Age: 25 + Math.floor(Math.random() * 10),
                    Phone: '1234567890',
                    Salary: 50000 + Math.floor(Math.random() * 50000),
                    Joining_date: new Date(),
                    Address: {
                        Line1: '123 Main St',
                        City: 'New York',
                        State: 'NY',
                        ZipCode: '10001'
                    }
                });
                await employeeEntry.save();
            }
        }

        console.log(chalk.blue('--------------------------------'));
        console.log(chalk.blue('Employees Seeded Successfully!'));
        console.log(chalk.blue('Default Password: Employee@123'));
        console.log(chalk.blue('--------------------------------'));

        process.exit(0);
    } catch (error) {
        console.error(chalk.red('Error seeding Employees:'), error);
        process.exit(1);
    }
};

seedEmployees();
