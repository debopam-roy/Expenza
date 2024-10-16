import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		description: {
			type: String,
			required: true,
		},
		mode: {
			type: String,
			enum: ["Cash", "Card", "Upi"],
			required: true,
		},
		category: {
			type: String,
			enum: ["Savings", "Expense", "Investment"],
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
			type: String,
			required: true,
		},
	},
	{ timestamps: false }
);

const Transaction = mongoose.model("transactions", TransactionSchema);
export default Transaction;
