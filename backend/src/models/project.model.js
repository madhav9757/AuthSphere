import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    publicKey: { type: String, required: true, unique: true, trim: true },
    privateKey: { type: String, required: true, unique: true, trim: true },
    developer: { type: mongoose.Schema.Types.ObjectId, ref: "Developer", required: true },
    redirectUris: [{ type: String, required: true }],
    allowedOrigins: [{ type: String }], // Security: Prevent cross-site request forgery
    providers: [{ type: String, enum: ["google", "github", "discord"], required: true }],
    logoUrl: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    settings: {
      requireEmailVerification: { type: Boolean, default: false },
      mfaEnabled: { type: Boolean, default: false },
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

projectSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.privateKey;
  return obj;
};

projectSchema.index({ developer: 1, name: 1 }, { unique: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;