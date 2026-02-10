// region imports
import mongoose from "mongoose";
import { getFormattedDateTime } from "../../utils/index.js";
// endregion

// region schema
const EmployeeSchema = new mongoose.Schema(
    {
        Employee_Id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
        },
        User_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        Admin_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },

        Employee_Code: {
            type: String,
            unique: true,
            sparse: true,
        },

        Age: {
            type: Number,
            default: 0,
        },

        Department: {
            type: String,
        },

        Phone: {
            type: String,
        },

        Salary: {
            type: Number,
            default: 0,
        },
        Reporting_Manager: {
            type: String,
        },

        Joining_date: {
            type: Date,
            default: getFormattedDateTime(),
        },

        Is_Active: {
            type: Number,
            default: 1,
        },

        Address: {
            Line1: { type: String },
            Line2: { type: String },
            City: { type: String },
            State: { type: String },
            ZipCode: { type: String },
        },

        Is_Deleted: {
            type: Number,
            default: 0,
        },

        Created_At: {
            type: String,
            default: () => getFormattedDateTime(),
        },

        Updated_At: {
            type: String,
            default: () => getFormattedDateTime(),
        },
    },
    {
        versionKey: false,
        timestamps: false,
    }
);
// endregion


// region indexes
EmployeeSchema?.index({ Employee_Id: 1 }, { unique: true });
EmployeeSchema?.index({ User_Id: 1 });
EmployeeSchema?.index({ Is_Deleted: 1 });
EmployeeSchema?.index({ Created_At: -1 });
// endregion


// region middleware
EmployeeSchema?.pre("save", function (next) {
    this.Updated_At = getFormattedDateTime();
});

EmployeeSchema?.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update) {
        if (!update.$set) update.$set = {};
        update.$set.Updated_At = getFormattedDateTime();
    }
});
// endregion


// region transforms
const transform = (doc, ret) => {
    if (ret) {
        delete ret.Password;
        delete ret.Is_Deleted;
    }
    return ret;
};

EmployeeSchema?.set("toJSON", { transform });
EmployeeSchema?.set("toObject", { transform });
// endregion


// region model
const Employee = mongoose?.model("Employee", EmployeeSchema);
// endregion


// region exports
export default Employee;
// endregion
