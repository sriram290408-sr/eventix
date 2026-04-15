import mongoose from "mongoose";

const participationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

participationSchema.index({ event: 1, user: 1 }, { unique: true });

const Participation = mongoose.model("Participation", participationSchema);

export default Participation;