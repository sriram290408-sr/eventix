import mongoose from "mongoose";

const participationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

participationSchema.index({ event: 1, user: 1 }, { unique: true });

participationSchema.index({ event: 1, status: 1 });
participationSchema.index({ user: 1, status: 1 });
participationSchema.index({ createdAt: -1 });

participationSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "approved") {
      this.approvedAt = new Date();
    }

    if (this.status === "rejected") {
      this.rejectedAt = new Date();
    }

    if (this.status === "cancelled") {
      this.cancelledAt = new Date();
    }
  }

  next();
});

const Participation = mongoose.model("Participation", participationSchema);

export default Participation;