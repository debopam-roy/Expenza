import User from "../models/Users.model.js";
import decodeToken from "../utils/decodeToken.js";

const queries = {
	ping: () => {},

	getUser: async (_, {}, context) => {
		try {
			const { id, name, email, phone, gender, profile_picture } =
				await decodeToken(context);
			return {
				authenticated: true,
				user: {
					id,
					name,
					email,
					phone,
					gender,
					profile_picture,
				},
			};
		} catch (error) {
			return {
				authenticated: false,
			};
		}
	},
};

const mutations = {
	registerUser: async (_, { user_details }, context) => {
		try {
			const existingUser = await User.findOne({
				email: user_details.email,
			});
			if (existingUser) {
				throw new Error("This email has already been used.");
			}
			const profile_picture = `https://avatar.iran.liara.run/public/${user_details.gender === "Male" ? "boy" : "girl"}?username=${user_details.name}`;
			const new_user = new User({
				profile_picture,
				...user_details,
			});
			await new_user.save();
			const user = await User.findById(new_user._id).select("-password");
			if (!user) {
				throw new Error("Failed to create new user.");
			}
			const access_token = await new_user.generateAccessToken();

			context.res.cookie("access_token", access_token, {
				httpOnly: true,
				secure: true,
				maxAge: 1000 * 60 * 60 * 24 * 10,
				sameSite: "Strict",
			});
			return access_token;
		} catch (error) {
			console.error("Error in registerUser:", error);
			throw new Error("Failed to register user.");
		}
	},

	loginUser: async (_, { user_details }, context) => {
		try {
			const existingUser = await User.findOne({
				email: user_details.email,
			});
			if (!existingUser) {
				throw new Error("No existing email address.");
			}
			const isUserVerified = await existingUser.isPasswordCorrect(
				user_details.password
			);
			if (!isUserVerified) {
				throw new Error("Incorrect password.");
			}
			const user = await User.findById(existingUser._id).select(
				"-password"
			);
			const access_token = await user.generateAccessToken();

			context.res.cookie("access_token", access_token, {
				httpOnly: true,
				secure: true,
				maxAge: 1000 * 60 * 60 * 24 * 10,
				sameSite: "Strict",
			});
			return access_token;
		} catch (error) {
			console.error("Error in loginUser:", error);
			throw new Error("Failed to login user.");
		}
	},

	logoutUser: async (_, __, context) => {
		try {
			context.res.clearCookie("access_token");
			console.log("User logged out successfully.");
			return "";
		} catch (error) {
			console.error("Error in logoutUser:", error.message);
			throw new Error("Failed to log out user.");
		}
	},
};

export const resolvers = { queries, mutations };
