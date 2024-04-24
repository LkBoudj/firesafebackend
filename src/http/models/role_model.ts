import { Schema, model, Types } from "mongoose";

const RoleSchema = new Schema<any>(
  {
    name: { type: String, required: true },
    displayName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const RoleModel = model("Role", RoleSchema);

export default RoleModel;
