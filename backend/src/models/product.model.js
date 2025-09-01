import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    productImage: {
        type: String,  // cloudinary url
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
    },
    warranty: {
        type: Number,
        default: 1,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    ratings: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
{
    timestamps: true,
}
)

export const Product = mongoose.model("Product",productSchema)