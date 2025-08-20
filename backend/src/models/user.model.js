import mongooose ,{Schema} from "mangoose";
import mongooseAggregatePaginate from "mongooose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index:true,
    },
    name:{
        type:String,
        required: true,
        trim: true,
        index: true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    role:{
        type: String,
        enum:[ user , seller , admin],
        default: user,
    }
})