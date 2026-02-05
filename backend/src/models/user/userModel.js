// region imports
import mongoose from "mongoose";
import {
  hashPassword,
  verifyPassword,
  getFormattedDateTime,
} from "../../utils/common/commonFunctions.js";
// endregion

// region schema
const UserSchema = new mongoose.Schema(
  {
    User_Id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    Name: {
      type: String,
    },

    Email: {
      type: String,
    },

    Password: {
      type: String,
    },

    Age: {
      type: Number,
      default: 0,
    },

    Role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"],
      default: "EMPLOYEE",
    },

    Department: {
      type: String,
    },

    Phone: {
      type: String,
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

    // manual timestamps
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
  },
);
// endregion

// region minimal indexes
// Email unique only for ACTIVE users
UserSchema?.index(
  { Email: 1 },
  { unique: true, partialFilterExpression: { Is_Deleted: 0 } },
);

// admin filtering and sorting
UserSchema?.index({ Role: 1, Is_Deleted: 1 });
UserSchema?.index({ Created_At: -1 }); // Optimize recent user sorting
UserSchema?.index({ Name: 1 }); // Optimize user searching

// endregion

// region middleware

/**
 * Pre-save hook to hash password and update the Updated_At timestamp.
 */
UserSchema?.pre("save", async function () {
  if (this?.isModified("Password")) {
    // Standardize: Only hash if it's not already hashed (prevents double-hashing)
    if (!this.Password?.startsWith("$argon2")) {
      this.Password = await hashPassword(this.Password);
    }
  }
  this.Updated_At = getFormattedDateTime();
});

/**
 * Pre-update hook to hash password (if provided) and update the Updated_At timestamp.
 */
UserSchema?.pre("findOneAndUpdate", async function () {
  const update = this?.getUpdate();
  if (!update) return;

  const pwd = update?.Password || update?.$set?.Password;

  if (pwd && !pwd?.startsWith("$argon2")) {
    const hashed = await hashPassword(pwd);
    if (update?.Password) update.Password = hashed;
    if (update?.$set?.Password) update.$set.Password = hashed;
  }

  if (!update?.$set) update.$set = {};
  update.$set.Updated_At = getFormattedDateTime();
});

// endregion

// region methods
/**
 * Instance method to compare a plain password with the stored hash.
 */
UserSchema.methods.comparePassword = async function (password = "") {
  return verifyPassword(password, this.Password) || false;
};
// endregion

// region transforms
const transform = (doc, ret) => {
  if (ret) {
    delete ret.Password;
    delete ret.Is_Deleted;
  }
  return ret;
};

UserSchema?.set("toJSON", { transform });
UserSchema?.set("toObject", { transform });
// endregion

// region model
const User = mongoose.model("User", UserSchema);
// endregion

// region exports
export default User;
// endregion
