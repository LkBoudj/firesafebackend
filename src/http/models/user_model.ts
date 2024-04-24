import { Schema, model, Types, InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new Schema<any>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dirRecorders: { type: String },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isLogin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // toJSON: true,
    // getters: true,
    // setter: true,
  }
);
export type UserType = InferSchemaType<typeof UserSchema>;
UserSchema.pre("save", async function (this: any, next: any) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hashSync(this.password, salt);

  // Replace the password with the hash
  this.password = hash;

  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // So we don't have to pass this into the interface method
  const user = this as any;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};
const userModel = model<UserType>("User", UserSchema);

export default userModel;
