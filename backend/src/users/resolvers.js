import User from "../models/Users.model.js";

const queries = {
	ping: () => "pong",
};

const mutations = {
	registerUser: async (_, { user_details }) => {
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
			return await new_user.generateAccessToken();
		} catch (error) {
			console.error("Error in registerUser:", error);
			throw new Error("Failed to register user.");
		}
	},

	loginUser: async (_, { user_details }) => {
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
			return await user.generateAccessToken();
		} catch (error) {
			console.error("Error in loginUser:", error);
			throw new Error("Failed to login user.");
		}
	},

	logoutUser: async (_, __, context) => {
		try {
			console.log("User logged out successfully.");
			return "";
		} catch (error) {
			console.error("Error in logoutUser:", error.message);
			throw new Error("Failed to log out user.");
		}
	},
};

export const resolvers = { queries, mutations };
