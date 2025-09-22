import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Product } from "./product.model";

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        pincode:{
            type:String,
            required:true
        },
        phoneNo:{
            type:Number,
            required: true
        },
    },
    orderDetails:[
        {
        productName:{
            type:Schema.Types.ProductId,
            ref:"Product"
        },
        price:{
            type:Number,
            required: true
        },
        quantity:{
            type: Number,
            default: 1
        },
        image:{
            type:String,
            required: true
        },
        product:{
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true
        },
    },
],
user:{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
},
paymentInfo:{
    id:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
},

})