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
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

// Automate password hashing before saving
endUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

endUserSchema.index({ projectId: 1, email: 1 }, { unique: true });
endUserSchema.index({ projectId: 1, username: 1 }, { unique: true });

const EndUser = mongoose.model("EndUser", endUserSchema);
export default EndUser;