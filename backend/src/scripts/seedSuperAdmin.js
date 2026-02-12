// region imports
//  config
import { connectDB } from "../config/index.js";

//  models
import User from "../models/user/userModel.js";
import Admin from "../models/admin/adminModel.js";

//  utils
import { ROLE } from "../utils/constants/constants.js";

//  libs
import chalk from "chalk";
// endregion

// region seed super admin
const seedSuperAdmin = async () => {
  try {
    //connect database
    await connectDB();

    //find existing super admin
    let superAdmin =
      (await User.findOne({ Role: ROLE?.SUPER_ADMIN || "SUPER_ADMIN" })) ||
      null;

    if (superAdmin) {
      console.log(
        chalk.yellow("Super Admin User found. Updating credentials..."),
      );

      //update credentials
      superAdmin.Email = "superadmin@spanadmin.com";
      superAdmin.Password = "SuperAdmin@123";

      await superAdmin.save();
    } else {
      console.log(chalk.green("Creating new Super Admin User..."));

      //create super admin user
      superAdmin = new User({
        Name: "Super Admin",
        Email: "superadmin@spanadmin.com",
        Password: "Pass&135",
        Role: ROLE?.SUPER_ADMIN || "SUPER_ADMIN",
      });

      await superAdmin.save();
    }

    //check admin collection entry
    const adminEntry =
      (await Admin.findOne({
        User_Id: superAdmin?.User_Id || null,
      })) || null;

    if (!adminEntry) {
      console.log(chalk.green("Creating entry in Admin collection..."));

      //create admin entry
      const newAdmin = new Admin({
        User_Id: superAdmin?.User_Id || null,
      });

      await newAdmin.save();
    } else {
      console.log(chalk.yellow("Admin collection entry already exists."));
    }

    console.log(chalk.blue("--------------------------------"));
    console.log(chalk.blue("Super Admin Seeded Successfully!"));
    console.log(chalk.blue("Email: superadmin@spanadmin.com"));
    console.log(chalk.blue("Password: Pass&135"));
    console.log(chalk.blue("--------------------------------"));

    process.exit(0);
  } catch (error) {
    console.error(chalk.red("Error seeding Super Admin:"), error || "");
    process.exit(1);
  }
};
// endregion

// region execute
seedSuperAdmin();
// endregion
