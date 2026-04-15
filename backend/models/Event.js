import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
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
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    locationUrl: {
      type: String,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },

    requireApproval: {
      type: Boolean,
      default: true,
    },

    ticketPrice: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;