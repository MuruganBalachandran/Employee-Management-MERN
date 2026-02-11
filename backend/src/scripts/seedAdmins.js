import { connectDB } from '../config/index.js';
import User from '../models/user/userModel.js';
import Admin from '../models/admin/adminModel.js';
import { ROLE } from '../utils/constants/constants.js';
import chalk from 'chalk';

const adminsData = [
    { name: 'Admin One', email: 'admin1@spanadmin.com' },
    { name: 'Admin Two', email: 'admin2@spanadmin.com' },
    { name: 'Admin Three', email: 'admin3@spanadmin.com' },
    { name: 'Admin Four', email: 'admin4@spanadmin.com' },
    { name: 'Admin Five', email: 'admin5@spanadmin.com' },
    { name: 'Admin Six', email: 'admin6@spanadmin.com' },
    { name: 'Admin Seven', email: 'admin7@spanadmin.com' },
    { name: 'Admin Eight', email: 'admin8@spanadmin.com' },
    { name: 'Admin Nine', email: 'admin9@spanadmin.com' },
    { name: 'Admin Ten', email: 'admin10@spanadmin.com' },
];

const seedAdmins = async () => {
    try {
        await connectDB();

        console.log(chalk.blue('Cleaning up existing Admins...'));
        const existingAdmins = await User.find({ Role: ROLE.ADMIN });
        const userIds = existingAdmins.map(u => u.User_Id);

        await Admin.deleteMany({ User_Id: { $in: userIds } });
        await User.deleteMany({ User_Id: { $in: userIds } });

        console.log(chalk.blue('Starting Admin Seeding...'));

        for (const admin of adminsData) {
            let user = await User.findOne({ Email: admin.email });

            if (user) {
                console.log(chalk.yellow(`Admin ${admin.name} already exists. Skipping...`));
            } else {
                console.log(chalk.green(`Creating Admin: ${admin.name}...`));
                user = new User({
                    Name: admin.name,
                    Email: admin.email,
                    Password: 'Pass&135',
                    Role: ROLE.ADMIN,
                });
                await user.save();

                const adminEntry = new Admin({
                    User_Id: user.User_Id,
                });
                await adminEntry.save();
            }
        }

        console.log(chalk.blue('--------------------------------'));
        console.log(chalk.blue('Admins Seeded Successfully!'));
        console.log(chalk.blue('Default Password: Pass&135'));
        console.log(chalk.blue('--------------------------------'));

        process.exit(0);
    } catch (error) {
        console.error(chalk.red('Error seeding Admins:'), error);
        process.exit(1);
    }
};

seedAdmins();
