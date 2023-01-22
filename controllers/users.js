import User from '../models/auth.js'
import mongoose from 'mongoose';

export const getAllUsers =async (req,res)=> {
    try {
        const alllUsers=await User.find();
        const allUserDetails=[];
        allUserDetails.forEach(users => {
            allUserDetails.push({_id: users._id,name: users.name,about:users.about,tags:users.tags,joinedOn:users.joinedOn});
        })
        // console.log(allUserDetails)
        res.status(200).json(alllUsers);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

export const updateProfile =async (req,res)=> {
    const id=req.params.id;
    const {name,about,tags}=req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send(`User unavailable...`);
    }

    try {
        const updatedProfile=await User.findByIdAndUpdate(id,{
            $set:{'name':name,'about':about,tags:tags}
        },{new:true})
        res.status(200).json(updateProfile);
    } catch (error) {
        res.status(405).json({message:error.message});
    }
}