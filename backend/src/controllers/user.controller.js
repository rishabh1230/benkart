import express from "express";
import { User } from "../models/user.model.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async(userId) =>{
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    }catch(error){
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
}  
const registerUser = asyncHandler(async(req, res) =>{
    // get input details to register
    // check weather the user already exists or not 
    // check weather the requird fields are there or not 
    // encrypt the password
    // modify all the required fields
    // create user for data base
    // upload the data
    const {username, fullname, password, email, role} = req.body;

    if(!username){
        throw new ApiError(400, "Username is required");
    }


    const existedUser = await User.findOne({
        $or :[{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(401, "User already exists");
    }

    
    const user = await User.create({
        username,
        fullname,
        email,
        password,
        role,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(400, "Something went wrong while creating the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "User Registered Successfully!!")
    )
 
})

export {registerUser}

const loginUser = asyncHandler(async(req , res) => {
    const {username , email , password} = req.body;

    if(!username && !email){
        throw new ApiError(400, "Username or Email is requird");
    }
    
    const user= await User.findOne({
        $or :[{username}, {email}]
    })

    if(!user){
        throw new ApiError(401, "User not registered");
    }

    const validPassword = await user.isPasswordCorrect(password);

    if(!validPassword){
        throw new ApiError(410, "Invalid User Credentials");
    }

    const {refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in Successfully"
        )
    )
})

export {loginUser}

const logoutUser = asyncHandler(async(req, res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset :{
                refreshToken: 1
            }
        },
            {
                new: true
            }
    )
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully"))
})
export {logoutUser}

const updateUser = asyncHandler(async(req, res) => {
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(401, "Unauthorized request")
    }

    const {username, fullname, email, role} = req.body;

    const updateFields = {};
    if(fullname) updateFields.fullname = fullname;
    if(username) updateFields.username = username;
    if(email) updateFields.email = email;
    if(role) updateFields.role = role;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set : updateFields
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if(!updatedUser){
        throw new ApiError(401, "User not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "User updated successfully"))

})

export {updateUser}
