import { connectDB } from '../config/index.js';
import User from '../models/user/userModel.js';
import Admin from '../models/admin/adminModel.js';
import { ROLE } from '../utils/constants/constants.js';
import chalk from 'chalk';

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    // 1. Find or Create User
    let superAdmin = await User.findOne({ Role: ROLE.SUPER_ADMIN });

    if (superAdmin) {
      console.log(chalk.yellow('Super Admin User found. Updating credentials...'));
      superAdmin.Email = 'superadmin@spanadmin.com';
      superAdmin.Password = 'SuperAdmin@123'; 
      await superAdmin.save();
    } else {
      console.log(chalk.green('Creating new Super Admin User...'));
      superAdmin = new User({
        Name: 'Super Admin',
        Email: 'superadmin@spanadmin.com',
        Password: 'SuperAdmin@123',
        Role: ROLE.SUPER_ADMIN,
      });
      await superAdmin.save();
    }

    // 2. Ensure Admin Collection Entry
    const adminEntry = await Admin.findOne({ User_Id: superAdmin.User_Id });
    if (!adminEntry) {
        console.log(chalk.green('Creating entry in Admin collection...'));
        const newAdmin = new Admin({ User_Id: superAdmin.User_Id });
        await newAdmin.save();
    } else {
        console.log(chalk.yellow('Admin collection entry already exists.'));
    }

    console.log(chalk.blue('--------------------------------'));
    console.log(chalk.blue('Super Admin Seeded Successfully!'));
    console.log(chalk.blue('Email: superadmin@spanadmin.com'));
    console.log(chalk.blue('Password: SuperAdmin@123'));
    console.log(chalk.blue('--------------------------------'));
    
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('Error seeding Super Admin:'), error);
    process.exit(1);
  }
};

seedSuperAdmin();
