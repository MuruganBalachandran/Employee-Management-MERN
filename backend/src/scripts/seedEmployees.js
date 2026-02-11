import { connectDB } from '../config/index.js';
import User from '../models/user/userModel.js';
import Employee from '../models/employee/employeeModel.js';
import Admin from '../models/admin/adminModel.js';
import { ROLE } from '../utils/constants/constants.js';
import chalk from 'chalk';

const employeesData = [
    { name: 'kumar', email: 'kumar@spanemployee.com', code: 'EMP001' },
    { name: 'raj', email: 'raj@spanemployee.com', code: 'EMP002' },
    { name: 'mike', email: 'mike@spanemployee.com', code: 'EMP003' },
    { name: 'rajesh', email: 'rajesh@spanemployee.com', code: 'EMP004' },
    { name: 'vicky', email: 'vicky@spanemployee.com', code: 'EMP005' },
    { name: 'sandy', email: 'sandy@spanemployee.com', code: 'EMP006' },
    { name: 'David', email: 'david@spanemployee.com', code: 'EMP007' },
    { name: 'Jessica', email: 'jessica@spanemployee.com', code: 'EMP008' },
    { name: 'Robert', email: 'robert@spanemployee.com', code: 'EMP009' },
    { name: 'john', email: 'john@spanemployee.com', code: 'EMP010' },
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
                    Password: 'Pass&135',
                    Role: ROLE.EMPLOYEE,
                });
                await user.save();

                const employeeEntry = new Employee({
                    User_Id: user.User_Id,
                    Admin_Id: admin.Admin_Id,
                    Employee_Code: emp.code,
                    Department: 'Full Stack Developer',
                    Age: 25 + Math.floor(Math.random() * 10),
                    Phone: '1234567890',
                    Salary: 50000 + Math.floor(Math.random() * 50000),
                    Reporting_Manager:"Prabhu",
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
        console.log(chalk.blue('Password: Pass&135'));
        console.log(chalk.blue('--------------------------------'));

        process.exit(0);
    } catch (error) {
        console.error(chalk.red('Error seeding Employees:'), error);
        process.exit(1);
    }
};

seedEmployees();
