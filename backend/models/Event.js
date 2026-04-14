const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },

    description: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Tech",
        "Food & Drink",
        "AI",
        "Arts & Culture",
        "Climate",
        "Fitness",
        "Wellness",
        "Crypto",
      ],
      index: true,
    },

    startDate: {
      type: Date,
      required: true,
      index: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    locationUrl: {
      type: String,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
      index: true,
    },

    requireApproval: {
      type: Boolean,
      default: false,
    },

    ticketPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    theme: {
      type: Object,
      default: null,
    },

    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "published",
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.pre("save", function (next) {
  if (this.startDate && this.endDate) {
    if (this.endDate < this.startDate) {
      return next(new Error("End date must be after start date"));
    }
  }
  next();
});

eventSchema.index({
  title: "text",
  location: "text",
  category: "text",
});

eventSchema.index({ visibility: 1, startDate: -1 });
eventSchema.index({ category: 1, startDate: -1 });
eventSchema.index({ creator: 1, createdAt: -1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
