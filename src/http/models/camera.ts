import { Schema, model, Types, InferSchemaType } from "mongoose";

// interface ItCamera {
//   name: string;
//   username?: string;
//   password?: string;
//   location?: string;
//   user: string;
//   streamUrl: string;
//   rtsp: string;
//   thumbnail: string;
//   pid: string;
//   isActive?: boolean;
// }

const CameraSchema = new Schema<any>(
  {
    name: { type: String, required: true },
    username: { type: String },
    password: { type: String },
    location: { type: String },
    user: { type: Types.ObjectId, ref: "User" },
    streamUrl: { type: String, required: true },
    rtsp: { type: String, required: true },
    thumbnail: { type: String },
    pid: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export type CameraType = InferSchemaType<typeof CameraSchema>;
const CameraModel = model("Camera", CameraSchema);

export default CameraModel;
