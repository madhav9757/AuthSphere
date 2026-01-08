import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, 
    },
    endUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EndUser",
      required: true,
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    isValid: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;