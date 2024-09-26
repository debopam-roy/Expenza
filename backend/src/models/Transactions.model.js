import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		mode: {
			type: String,
			enum: ["cash", "card", "upi"],
			required: true,
		},
		category: {
			type: String,
			enum: ["savings", "expense", "investment"],
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		location: {
			type: String,
			default: "Unknown",
		},
		date: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

const Transaction = mongoose.model("transactions", TransactionSchema);
export default Transaction;
