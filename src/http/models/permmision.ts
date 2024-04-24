import { Schema, model } from "mongoose";

const PermissionSchema = new Schema<any>(
  {
    name: { type: String, required: true },
    displayName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// methods.users = function () {
//   const role = this;
//   const all = RolePermissionModel.find({ role });
//   console.log(all);
// };

const permissionModel = model("Permission", PermissionSchema);

export default permissionModel;
