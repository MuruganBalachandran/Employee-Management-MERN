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


// region seed data
const adminsData = [
  { name: "Admin One", email: "admin1@spanadmin.com" },
  { name: "Admin Two", email: "admin2@spanadmin.com" },
  { name: "Admin Three", email: "admin3@spanadmin.com" },
  { name: "Admin Four", email: "admin4@spanadmin.com" },
  { name: "Admin Five", email: "admin5@spanadmin.com" },
  { name: "Admin Six", email: "admin6@spanadmin.com" },
  { name: "Admin Seven", email: "admin7@spanadmin.com" },
  { name: "Admin Eight", email: "admin8@spanadmin.com" },
  { name: "Admin Nine", email: "admin9@spanadmin.com" },
  { name: "Admin Ten", email: "admin10@spanadmin.com" },
];
// endregion


// region seed admins
const seedAdmins = async () => {
  try {
    //connect database
    await connectDB();

    console.log(chalk.blue("Cleaning up existing Admins..."));

    //fetch existing admins
    const existingAdmins =
      (await User.find({ Role: ROLE?.ADMIN || "ADMIN" })) || [];

    const userIds =
      existingAdmins?.map((u) => u?.User_Id || null) || [];

    //delete existing admin profiles
    await Admin.deleteMany({
      User_Id: { $in: userIds || [] },
    });

    //delete existing users
    await User.deleteMany({
      User_Id: { $in: userIds || [] },
    });

    console.log(chalk.blue("Starting Admin Seeding..."));

    //loop seed data
    for (let i = 0; i < adminsData.length; i++) {
      const admin = adminsData[i];

      //check existing user
      let user =
        (await User.findOne({ Email: admin?.email || "" })) || null;

      if (user) {
        console.log(
          chalk.yellow(
            `Admin ${admin?.name || ""} already exists. Skipping...`
          )
        );
      } else {
        console.log(
          chalk.green(`Creating Admin: ${admin?.name || ""}...`)
        );

        //create user
        user = new User({
          Name: admin?.name || "",
          Email: admin?.email || "",
          Password: "Pass&135",
          Role: ROLE?.ADMIN || "ADMIN",
        });

        await user.save();

        // Alternate permissions: even index = GRANTED, odd index = REVOKED
        const permissions = i % 2 === 0 ? "GRANTED" : "REVOKED";

        //create admin profile with permissions
        const adminEntry = new Admin({
          User_Id: user?.User_Id || null,
          Permissions: permissions,
        });

        await adminEntry.save();

        console.log(
          chalk.cyan(`  → Permissions: ${permissions}`)
        );
      }
    }

    console.log(chalk.blue("--------------------------------"));
    console.log(chalk.blue("Admins Seeded Successfully!"));
    console.log(chalk.blue("Default Password: Pass&135"));
    console.log(chalk.blue("--------------------------------"));

    process.exit(0);
  } catch (error) {
    console.error(
      chalk.red("Error seeding Admins:"),
      error || ""
    );
    process.exit(1);
  }
};
// endregion


// region execute
seedAdmins();
// endregion
