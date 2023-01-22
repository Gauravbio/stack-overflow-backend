import Questions from '../models/Questions.js';
import mongoose from 'mongoose';
// import Question from '../models/Questions.js'

export const AskQuestion = async (req,res)=> {
    const postQuestionData = req.body;

    const postQuestion=new Questions({...postQuestionData});

    try {
        await postQuestion.save();
        res.status(200).json("Posted a question successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json("Could not post question");
    }
}

export const getAllQuestions =async (req,res)=> {
    try {
        const questionList =await Questions.find();
        res.status(200).json(questionList);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const deleteQuestion = async (req,res)=> {
    const id=req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send(`question unavailable...`);
    }

    try {
        await Questions.findByIdAndRemove(id);
        res.status(200).json({message:"successfully deleted..."});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const voteQuestion =async (req,res)=> {
    const id=req.params.id;
    const {value,userId}=req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send(`question unavailable...`);
    }

    try {
        const question=await Questions.findById(id);
        const upIndex=await question.upVote.findIndex((id)=> id===String(userId));
        const downIndex= await question.downVote.findIndex((id)=> id===String(userId));

        if(value==='upvote') {
            if(downIndex !==-1) {
                question.downVote = await question.downVote.filter((id)=> id !==String(userId))
            }
            if(upIndex===-1) {
                question.upVote.push(userId);
            }
            else {
                question.upVote=await question.upVote.filter((id)=> id!==String(userId))
            }
        }
        if(value==='downvote') {
            if(upIndex !==-1) {
                question.upVote = await question.upVote.filter((id)=> id !==String(userId))
            }
            if(downIndex===-1) {
                question.downVote.push(userId);
            }
            else {
                question.downVote=question.downVote.filter((id)=> id!==String(userId))
            }
        }

        await Questions.findByIdAndUpdate(id,question);
        res.status(200).json({message:"voted successfully"});
    } catch (error) {
        // console.log("yaha");
        res.status(404).json({message: error.message});
    }
}