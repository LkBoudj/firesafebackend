import { Schema, model, Types } from "mongoose";
const RolePermissionSchema = new Schema<any>(
  {
    role: { type: Types.ObjectId, ref: "Role" },
    permission: { type: Types.ObjectId, ref: "Permission" },
  },
  {
    timestamps: true,
  }
);

const rolePermission = model("RolePermission", RolePermissionSchema);

export default rolePermission;
