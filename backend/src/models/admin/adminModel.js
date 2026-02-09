// region imports
import mongoose from "mongoose";
import validator from "validator";
import { getFormattedDateTime } from "../../utils/common/commonFunctions.js";
// endregion


// region schema
const AdminSchema = new mongoose.Schema(
    {
        Admin_Id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
        },
        User_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },


        // manual timestamps
        Created_At: {
            type: String,
            default: () => getFormattedDateTime()
        },

        Updated_At: {
            type: String,
            default: () => getFormattedDateTime()
        },
    },
    {
        versionKey: false,
        timestamps: false,
    }
);
// endregion


// region minimal indexes
// Email unique only for ACTIVE admins
// admin filtering and sorting
AdminSchema?.index({ Admin_Id: 1 }, { unique: true }); // Important for lookups and updates
AdminSchema?.index({ User_Id: 1 });
AdminSchema?.index({ Is_Deleted: 1 });
AdminSchema?.index({ Created_At: -1 }); // Optimize recent admin sorting

// endregion


// region middleware
AdminSchema?.pre("save", function (next) {
    this.Updated_At = getFormattedDateTime();
});

AdminSchema?.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update) {
         if (!update.$set) update.$set = {};
         update.$set.Updated_At = getFormattedDateTime();
    }
});
// endregion



// endregion


// endregion


// region transforms
const transform = (doc, ret) => {
    if (ret) {
        delete ret.Password;
        delete ret.Is_Deleted;
    }
    return ret;
};

AdminSchema?.set("toJSON", { transform });
AdminSchema?.set("toObject", { transform });
// endregion


// region model
const Admin = mongoose?.model("Admin", AdminSchema);
// endregion


// region exports
export default Admin;
// endregion
