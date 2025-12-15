// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// const generateAccessAndRefreshTokens = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();
//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw new ApiError(500, "Error generating tokens");
//   }
// };

// const registerUser = asyncHandler(async (req, res) => {
//   const { fullName, username, email, password, role } = req.body; 
  
//   if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
//     throw new ApiError(400, "All fields are required");
//   }
  
//   const existedUser = await User.findOne({
//     $or: [{ username }, { email }],
//   });

//   if (existedUser) {
//     throw new ApiError(409, "User already exists");
//   }

//   const userRole = role && ['admin', 'user'].includes(role) ? role : 'user';

//   const user = await User.create({
//     fullName,
//     email,
//     password,
//     username: username.toLowerCase(),
//     role: userRole, 
//   });

//   const createdUser = await User.findById(user._id).select("-password -refreshToken");

//   if (!createdUser) {
//     throw new ApiError(500, "Error while registering user");
//   }
  
//   console.log('User registered with role:', createdUser.role); 
  
//   return res
//     .status(201)
//     .json(new ApiResponse(200, createdUser, "User registered successfully"));
// });

// const loginUser = asyncHandler(async (req, res) => {
//   const { email, username, password } = req.body;

//   if (!username && !email) {
//     throw new ApiError(400, "Username or email is required");
//   }

//   if (!password) {
//     throw new ApiError(400, "Password is required");
//   }

//   const user = await User.findOne({
//     $or: [{ username }, { email }]
//   });

//   if (!user) {
//     throw new ApiError(404, "User does not exist");
//   }

//   const isPasswordValid = await user.isPasswordCorrect(password);

//   if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid user credentials");
//   }

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

//   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

//   const options = {
//     httpOnly: true,
//     secure: true
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiResponse(
//         200,
//         {
//           user: loggedInUser,  
//           accessToken,
//           refreshToken
//         },
//         "User logged in successfully"
//       )
//     );
// });

// export { registerUser, loginUser };

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (user) => {
  try {
    console.log("Generating tokens for user:", user._id);
    
    const accessToken = user.generateAccessToken();
    console.log("Access token generated");
    
    const refreshToken = user.generateRefreshToken();
    console.log("Refresh token generated");
    
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    console.log("User saved with refresh token");

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new ApiError(500, "Error generating tokens: " + error.message);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password, role } = req.body; 
  
  if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const userRole = role && ['admin', 'user'].includes(role) ? role : 'user';

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    role: userRole, 
  });

  const createdUser = user.toObject();
  delete createdUser.password;
  delete createdUser.refreshToken;

  if (!createdUser) {
    throw new ApiError(500, "Error while registering user");
  }
  
  console.log('User registered with role:', createdUser.role); 
  
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log("Login attempt for:", username || email);

    if (!username && !email) {
      throw new ApiError(400, "Username or email is required");
    }

    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (!user) {
      console.log("User not found");
      throw new ApiError(404, "User does not exist");
    }

    console.log("User found, checking password");
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      console.log("Invalid password");
      throw new ApiError(401, "Invalid user credentials");
    }

    console.log("Password valid, generating tokens");
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

    const loggedInUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      orderHistory: user.orderHistory,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const options = {
      httpOnly: true,
      secure: true, // Always true for HTTPS
      sameSite: "none", // Changed to "none" for cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    };

    console.log("Login successful, sending response");
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,  
            accessToken,
            refreshToken
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
});

export { registerUser, loginUser };