const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  //Schema properties
  question: String,
  choice1: String,
  choice2: String,
  choice3: String,
  choice4: String,
  answer: String,
  day: String
});

//Create the Quiz model with mongoose.
const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;
