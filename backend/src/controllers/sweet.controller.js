import { asyncHandler } from "../utils/asyncHandler.js";
import { Sweet } from "../models/sweets.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const addSweet = asyncHandler(async (req, res) => {
  console.log("FILE 👉", req.file);

  const { name, flavor, price, category } = req.body;
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
  });
  return res
    .status(201)
    .json(new ApiResponse(200, sweetCreated, "Sweet created successfully"));
});

export { addSweet };
