import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    attachments: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
