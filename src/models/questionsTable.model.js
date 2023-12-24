import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  tableName: {
    type: String,
    required: true,
    unique: true,
  },
  tableUrl: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model("QuestionTable", TableSchema);
