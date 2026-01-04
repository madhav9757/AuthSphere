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
      unique: true,
    },

    privateKey: {
      type: String,
      required: [true, "Private key is required"],
      trim: true,
      unique: true,
    },

    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Developer",
      required: true,
    },
  },
  { timestamps: true }
);

// Hide private key from every API response
projectSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.privateKey;
  return obj;
};

// Prevent duplicate project name per developer
projectSchema.index({ developer: 1, name: 1 }, { unique: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
