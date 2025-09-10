import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: ["created", "status_changed", "assigned", "commented", "priority_changed"], required: true },
    oldValue: String,
    newValue: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
