import jwt from 'jsonwebtoken';
import bcrpyt from 'bcryptjs';
import users from '../models/auth.js'

export const signup=async (req,res)=> {
    const {name,email,password}=req.body;
    try {
        const existingUser=await users.findOne({email});
        if(existingUser) return res.status(400).json({message:"User already exist"})
        const hashedPassword=await bcrpyt.hash(password,12);
        const newUser=await users.create({name,email,password:hashedPassword});
        const token=jwt.sign({email: newUser.email,id:newUser._id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.status(201).json({result:newUser,token});
    } catch (error) {
        res.status(500).json({
            message :error.message
        })
    }
}

export const login= async (req,res)=> {
    const {email,password}=req.body;
    try {
        
        const existingUser=await users.findOne({email});

        if(!existingUser) return res.status(401).json({message:"Please signup"});

        const isPasswordCrt=await bcrpyt.compare(password,existingUser.password)
        if(!isPasswordCrt) return res.status(400).json({message:"Invalid credentials"})

        const token=jwt.sign({email: existingUser.email,id:existingUser._id},process.env.JWT_SECRET,{expiresIn:'1h'});

        res.status(201).json({result:existingUser,token});

    } catch (error) {
        res.status(500).json({
            message :error.message
        })
    }
}