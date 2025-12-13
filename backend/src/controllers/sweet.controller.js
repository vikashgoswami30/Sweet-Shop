import { asyncHandler } from "../utils/asyncHandler.js";
import { Sweet } from "../models/sweets.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const addSweet = asyncHandler(async (req, res) => {
  const { name, flavor, price, category } = req.body;
  if ([name, flavor, price, category].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All sweets fields are required");
  }

  const sweetImageLocalPath = req.files?.sweetImage[0]?.path;
  if (!sweetImageLocalPath) {
    throw new ApiError(400, "Sweet image is required");
  }

  const sweetImage = await uploadOnCloudinary(sweetImageLocalPath);
  if (!sweetImage) {
    throw new ApiError(400, "Sweet Image is required");
  }

  const sweetCreated = await Sweet.create({
    name,
    sweetImage: sweetImage?.url || "",
    flavor,
    price,
    category,
  });
  return res
    .status(201)
    .json(new ApiResponse(200, sweetCreated, "Sweet created successfully"));
});

export { addSweet };
