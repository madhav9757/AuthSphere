import mongoose from "mongoose";

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
      select: false, // Prevent leaking hash by default
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate email or username **within the same project**
endUserSchema.index(
  { projectId: 1, email: 1 },
  { unique: true }
);

endUserSchema.index(
  { projectId: 1, username: 1 },
  { unique: true }
);

const EndUser = mongoose.model("EndUser", endUserSchema);
export default EndUser;
