// region imports
import mongoose from "mongoose";
import { getFormattedDateTime } from "../../utils/index.js";
// endregion


// region schema
const AdminSchema = new mongoose.Schema(
  {
    Admin_Id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },

    User_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    Admin_Code: {
      type: String,
    },

    Age: {
      type: Number,
    },

    Department: {
      type: String,
    },

    Phone: {
      type: String,
    },

    Salary: {
      type: String,
    },

    Permissions: {
      type: String,
      enum: ["GRANTED", "REVOKED"],
      default: "GRANTED",
    },

    Joining_Date: {
      type: String,
      default: () => getFormattedDateTime(),
    },

    Is_Active: {
      type: Number,
      default: 1,
    },

    Address: {
      Line1: { type: String, default: "" },
      Line2: { type: String, default: "" },
      City: { type: String, default: "" },
      State: { type: String, default: "" },
      ZipCode: { type: String, default: "" },
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
AdminSchema.index({ Admin_Id: 1 }, { unique: true });
AdminSchema.index({ User_Id: 1 });
AdminSchema.index({ Is_Deleted: 1 });
AdminSchema.index({ Created_At: -1 });
AdminSchema.index({ Department: 1, Is_Deleted: 1 });
// endregion


// region middleware
AdminSchema.pre("save", function (next) {
  this.Updated_At = getFormattedDateTime();
});

AdminSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  if (!update.$set) {
    update.$set = {};
  }
  update.$set.Updated_At = getFormattedDateTime();
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

AdminSchema.set("toJSON", { transform });
AdminSchema.set("toObject", { transform });
// endregion


// region model
const Admin = mongoose.model("Admin", AdminSchema);
// endregion


// region exports
export default Admin;
// endregion
