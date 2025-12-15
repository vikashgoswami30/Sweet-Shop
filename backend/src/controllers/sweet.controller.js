import { asyncHandler } from "../utils/asyncHandler.js";
import { Sweet } from "../models/sweets.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const addSweet = asyncHandler(async (req, res) => {

  const { name, flavor, price, category ,quantity} = req.body;
  if ([name, flavor, category].some((field) => !field?.trim()) || !price) {
    throw new ApiError(400, "All sweets fields are required");
  }

  const sweetImageLocalPath = req.file?.path;
  if (!sweetImageLocalPath) {
    throw new ApiError(400, "Sweetlocalpath image is required");
  }

  const sweetImage = await uploadOnCloudinary(sweetImageLocalPath);
  if (!sweetImage) {
    throw new ApiError(
      400,
      "Sweet Image is required for uploading into cloudinary"
    );
  }

  const sweetCreated = await Sweet.create({
    name,
    sweetImage: sweetImage.secure_url,
    flavor,
    price,
    category,
    quantity: quantity || 10,
  });
  return res
    .status(201)
    .json(new ApiResponse(200, sweetCreated, "Sweet created successfully"));
});

const getAllSweets = asyncHandler(async (req, res) => {
  const sweets = await Sweet.find().sort({ createdAt: -1 });
  
  return res
    .status(200)
    .json(new ApiResponse(200, sweets, "Sweets fetched successfully"));
});

const searchSweets = asyncHandler(async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  
  let query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sweets = await Sweet.find(query).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, sweets, "Search results fetched successfully"));
});

const updateSweet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, flavor, price, category, quantity } = req.body;

  const sweet = await Sweet.findById(id);
  if (!sweet) {
    throw new ApiError(404, "Sweet not found");
  }

  // Update fields if provided
  if (name) sweet.name = name;
  if (flavor) sweet.flavor = flavor;
  if (price) sweet.price = price;
  if (category) sweet.category = category;
  if (quantity !== undefined) sweet.quantity = quantity;

  // Handle image update
  if (req.file) {
    const sweetImage = await uploadOnCloudinary(req.file.path);
    if (sweetImage) {
      sweet.sweetImage = sweetImage.secure_url;
    }
  }

  await sweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, sweet, "Sweet updated successfully"));
});

const deleteSweet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sweet = await Sweet.findByIdAndDelete(id);
  if (!sweet) {
    throw new ApiError(404, "Sweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Sweet deleted successfully"));
});

const purchaseSweet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    throw new ApiError(400, "Valid quantity is required");
  }

  const sweet = await Sweet.findById(id);
  if (!sweet) {
    throw new ApiError(404, "Sweet not found");
  }

  if (sweet.quantity < quantity) {
    throw new ApiError(400, `Only ${sweet.quantity} items available in stock`);
  }

  sweet.quantity -= quantity;
  await sweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, sweet, `Successfully purchased ${quantity} ${sweet.name}`));
});

const restockSweet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    throw new ApiError(400, "Valid quantity is required");
  }

  const sweet = await Sweet.findById(id);
  if (!sweet) {
    throw new ApiError(404, "Sweet not found");
  }

  sweet.quantity += quantity;
  await sweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, sweet, `Successfully restocked ${quantity} ${sweet.name}`));
});



export { addSweet ,getAllSweets,searchSweets,updateSweet,deleteSweet,purchaseSweet,restockSweet};
