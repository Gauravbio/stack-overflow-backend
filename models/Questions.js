import mongoose, { mongo } from 'mongoose';

const questionSchema = mongoose.Schema({
    questionTitle: {type:String,required:"Questionmust have title"},
    questionBody: {type:String,required:"Questionmust have body"},
    questionTags: {type:[String],required:"Questionmust have tags"},
    noOfAnswers: {type: Number,default:0},
    upVote: {type: [String],default: []},
    downVote: {type: [String],default: []},
    userPosted: {type: String, required: "Question must have an author"},
    userId: {type: String},
    askedOn :{type: Date,default: Date.now()},
    answer:[{
        answerBody: String,
        userAnswered:String,
        userId: String,
        answeredOn: {type: Date,default: Date.now()}
    }]
})

export default mongoose.model("Question",questionSchema)