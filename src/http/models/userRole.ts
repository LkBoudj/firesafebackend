import { Schema, model, Types } from "mongoose";

const UserRoleSchema = new Schema<any>({
  role: { type: Types.ObjectId, ref: "Role" },
  user: { type: Types.ObjectId, ref: "User" },
});

const userRoleMode = model("UserRole", UserRoleSchema);

export default userRoleMode;
