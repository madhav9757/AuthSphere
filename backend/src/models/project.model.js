import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    publicKey: {
      type: String,
      required: [true, "Public key is required"],
      trim: true,
    },
    privateKey: {
      type: String,
      required: [true, "Private key is required"],
      trim: true,
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Developer",
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
