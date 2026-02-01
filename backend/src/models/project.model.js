import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    publicKey: { type: String, required: true, unique: true, trim: true },
    privateKey: { type: String, required: true, unique: true, trim: true },
    developer: { type: mongoose.Schema.Types.ObjectId, ref: "Developer", required: true },
    redirectUris: [{ type: String, required: true }],
    allowedOrigins: [{ type: String }], // Security: Prevent cross-site request forgery
    providers: [{ type: String, enum: ["local", "google", "github", "discord", "linkedin", "gitlab", "twitch", "bitbucket", "microsoft"], required: true }],
    logoUrl: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    settings: {
      requireEmailVerification: { type: Boolean, default: false },
      mfaEnabled: { type: Boolean, default: false },
      // Token Lifecycle Management
      tokenValidity: {
        accessToken: { type: Number, default: 900 }, // 15 mins in seconds
        refreshToken: { type: Number, default: 604800 }, // 7 days in seconds
      },
    },
    emailTemplate: {
      logoUrl: { type: String },
      primaryColor: { type: String, default: "#4f46e5" },
      subjectLine: { type: String, default: "Your Verification Code" },
      footerText: { type: String, default: "Secure Identity for Developers" },
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