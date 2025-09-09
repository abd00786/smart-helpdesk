import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "low" },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
    category: { type: String, enum: ["hardware", "software", "network", "other"], default: "other" },
    resolutionTime: Number,
    slaDeadline: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
