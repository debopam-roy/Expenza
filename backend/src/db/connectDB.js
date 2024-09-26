import mongoose from "mongoose";

async function connectDB() {
	try {
		const connectdb = await mongoose.connect(process.env.MONGODB_URI);
		console.log(
			`Successfully connected to Mongodb, ${connectdb.connection.host}`
		);
	} catch (error) {
		throw new ApiError(500, "Error occured while connecting to Mongodb.", [
			error.message,
		]);
	}
}

export default connectDB;
