import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  questionTable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionTable",
    required: true,
  },
  questionLink: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Question", QuestionSchema);
