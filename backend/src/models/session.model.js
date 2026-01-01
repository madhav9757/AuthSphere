import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    endUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EndUser",
        required: true,
    }
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
