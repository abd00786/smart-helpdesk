import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"]
    },
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

// Handle duplicate email error
userSchema.post("save", function(err, doc, next) {
  if (err.name === "MongoServerError" && err.code === 11000) {
    next(new Error("Email already registered"));
  } else {
    next(err);
  }
});

export default mongoose.model("User", userSchema);
