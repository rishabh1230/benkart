const asyncHandler = (requestHandeler) =>{
    return (req , res , next) =>{
        promises.resolve(requestHandeler(req , res , 
            next)).catch((error) => next(error))
    }
}

export {asyncHandeler}