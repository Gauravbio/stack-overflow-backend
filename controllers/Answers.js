import mongoose from "mongoose";
import Questions from "../models/Questions.js"
import users from '../models/auth.js'

export const postAnswer = async (req,res) => {
    const id=req.params.id;
    const {noOfAnswers,answerBody,userAnswered,userId}=req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send(`question unavailable...`);
    }

    try {

        const updatedQuestion=await Questions.findByIdAndUpdate(id,{
            $addToSet:{'answer':{answerBody,userAnswered,userId}}
        })
        updateNoOfQuestions(id,noOfAnswers);

        return res.status(200).json(updatedQuestion)
    } catch (error) {
        return res.status(400).json(error)
    }

}

const updateNoOfQuestions=async (_id,noOfAnswers)=> {
    try {
        await Questions.findByIdAndUpdate(_id,{$set: {"noOfAnswers":noOfAnswers}})

    } catch (error) {
        console.log(error);
    }
}

export const deleteAnswer =async (req,res) => {
    const id=req.params.id;
    const {answerId,noOfAnswers}=req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send(`question unavailable...`);
    }

    if(!mongoose.Types.ObjectId.isValid(answerId)){
        return res.status(404).send(`answer unavailable...`);
    }

    updateNoOfQuestions(_id,noOfAnswers);
    try {
        await Questions.updateOne({_id},{
            $pull:{'answer': {_id:answerId}}
        })
        res.status(200).json({message: "Successfully deleted"});
    } catch (error) {
        res.status(405).json(error);
    }
}

