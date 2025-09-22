import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";


const createProduct = asyncHandler(async(req, res) =>{
  
    const {name , description, price, brand, category, stock, warranty} = req.body;

    if(!name || !description || !price  || !brand || !category ){
        throw new ApiError(400, "All fields are required")
    }

    const productImageLocalPath = req.files?.productImage[0]?.path;

    if(!productImageLocalPath){
        throw new ApiError(400, "Product Image is required")
    }

    const productImage = await uploadOnCloudinary(productImageLocalPath);

    if(!productImage){
        throw new ApiError(400,"Product Image is Requires")
    }
    
    const product = await Product.create({
        name,
        description,
        price,
        brand,
        category,
        warranty,
        stock,
        productImage: productImage.url,
        owner: req.user?._id || null
    })

    const createdProduct = await Product.findById(product._id)

    if(!createdProduct){
        throw new ApiError(401, "Something went wrong while uploading the product")
    }

    return res.status(201).json(
        new ApiResponse(201, createdProduct, "Product created Successfully")
    )
})

export {createProduct}

const getAllProducts = asyncHandler(async (req, res) => {
    // 1. Extract query parameters with default values
    const {
        page = 1,
        limit = 10,
        category,
        search,
        sort,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // 2. Build the query filter based on search and category
    const query = {};
    if (search) {
        // Use a case-insensitive regex for searching in name and description
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    if (category) {
        query.category = category;
    }

    // 3. Build the sort options
    const sortOptions = {};
    if (sort) {
        // Example: sort=price_asc or sort=name_desc
        const [field, order] = sort.split('_');
        sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
        // Default sort by creation date (newest first)
        sortOptions.createdAt = -1;
    }

    try {
        // 4. Get the total count of documents matching the query for pagination metadata
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limitNumber);

        // 5. Fetch the products from the database with pagination and sorting
        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNumber);

        if (!products || products.length === 0) {
            // Return an empty array and success status if no products are found
            return res.status(200).json(
                new ApiResponse(200, {
                    products: [],
                    totalProducts: 0,
                    totalPages: 0,
                    currentPage: 0
                }, "No products found with the given criteria")
            );
        }

        // 6. Return a successful response with the product data and pagination metadata
        return res.status(200).json(
            new ApiResponse(200, {
                products,
                totalProducts,
                totalPages,
                currentPage: pageNumber
            }, "Products fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching products", [error.message]);
    }
});

export { getAllProducts };

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(400, "Product not found")
  }

  // check ownership or admin role
  if (product.owner.toString() !== req.user._id && req.user.role !== "admin") {
    throw new ApiError(410, "Unauthorized request")
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if(!updatedProduct){
    throw new ApiError(401, "Product not updated")
  }

  res.status(200).json(updatedProduct);
});

export {updateProduct}

const getProduct = asyncHandler(async(req , res) =>{
    const product = await Product.findById(req.params.id);

    if(!product){
        throw new ApiError(401, "Product not found");
    }

    return res.status(200).json(product)

})

export {getProduct};


































