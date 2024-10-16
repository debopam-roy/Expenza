import User from "../models/Users.model.js";

const decodeToken = async (context) => {
	const cookies = context.req.headers.cookie;

	if (!cookies) {
		throw new Error("Unauthorized: No cookies found.");
	}
	const parsedCookies = Object.fromEntries(
		cookies.split("; ").map((cookie) => cookie.split("="))
	);
	const token = parsedCookies.access_token || "";
	if (!token) {
		throw new Error("Unauthorized: Token is missing.");
	}
	const decodedUser = await User.verifyAccessToken(token);
	const { id, name, email, phone, gender, profile_picture } = decodedUser;

	if (!id) {
		throw new Error("Unauthorized: User is not logged in.");
	}

	return {
		id,
		name,
		email,
		phone,
		gender,
		profile_picture,
	};
};

export default decodeToken;
