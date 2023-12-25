import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  questionLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

export default mongoose.model("Submission", SubmissionSchema);
