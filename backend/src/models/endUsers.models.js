import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Recommended for hashing

const endUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "guest"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    verificationOTPExpiry: { type: Date },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    picture: { type: String, default: "" },
    provider: { type: String, default: "local" },
    providerId: { type: String },
  },
  { timestamps: true }
);

endUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

endUserSchema.index({ projectId: 1, email: 1 }, { unique: true });
endUserSchema.index({ projectId: 1, username: 1 }, { unique: true });
endUserSchema.index({ projectId: 1, createdAt: -1 });
endUserSchema.index({ projectId: 1, provider: 1 });

const EndUser = mongoose.model("EndUser", endUserSchema);
export default EndUser;