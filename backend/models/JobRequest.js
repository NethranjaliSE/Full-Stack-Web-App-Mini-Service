import mongoose from "mongoose";

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Plumbing", "Electrical", "Painting", "Joinery","Cleaning", "Other"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    contactName: {
      type: String,
      required: [true, "Contact name is required"],
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      match: [
        /^\s*[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}\s*$/,
        "Please fill a valid email address",
      ],
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "jobRequests" }, 
);

export default mongoose.model("JobRequest", jobRequestSchema);
