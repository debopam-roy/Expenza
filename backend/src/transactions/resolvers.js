import Transaction from "../models/Transactions.model.js";
import decodeToken from "../utils/decodeToken.js";
import mongoose from "mongoose";

const queries = {
	fetchTransactions: async (_, __, context) => {
		try {
			const { id, name, email, phone, gender, profile_picture } =
				await decodeToken(context);
			const transactions = await Transaction.find({ user_id: id })
				.select("-user_id -__v")
				.lean();

			const formattedTransactions = transactions.map(
				(transaction) => transaction
			);
			return formattedTransactions;
		} catch (error) {
			console.error("Error in fetchTransactions:", error);
			throw new Error("Failed to fetch transactions.");
		}
	},

	fetchTransaction: async (_, { transaction_id }, context) => {
		try {
			const { id, name, email, phone, gender, profile_picture } =
				await decodeToken(context);
			const transaction = await Transaction.findById(transaction_id);
			if (!transaction || transaction.user_id.toString() !== id) {
				throw new Error("Transaction not found or unauthorized.");
			}
			return transaction;
		} catch (error) {
			console.error("Error in fetchTransaction:", error);
			throw new Error("Failed to fetch transaction.");
		}
	},

	fetchTransactionStatistics: async (_, __, context) => {
		try {
			const { id, name, email, phone, gender, profile_picture } =
				await decodeToken(context);
			const transactions = await Transaction.find({ user_id: id }).select(
				"-_id -description -mode -location -date -user_id -__v"
			);
			const categoryMap = {};

			transactions.forEach((transaction) => {
				if (!categoryMap[transaction.category]) {
					categoryMap[transaction.category] = 0;
				}
				categoryMap[transaction.category] += transaction.amount;
			});
			const transaction_statistics = Object.entries(categoryMap).map(
				([category, amount]) => ({
					category,
					amount,
				})
			);
			
			return transaction_statistics;
		} catch (error) {
			console.error("Error in fetching transaction statistics:", error);
			throw new Error("Failed to fetch transaction statistics.");
		}
	},
};

const mutations = {
	createTransaction: async (_, { transaction_details }, context) => {
		try {
			const { id, name, email, phone, gender, profile_picture } =
				await decodeToken(context);
			const newTransaction = await Transaction.create({
				user_id: id,
				...transaction_details,
			});

			return newTransaction;
		} catch (error) {
			console.error("Error in createTransaction:", error);
			throw new Error("Failed to create transaction.");
		}
	},

	updateTransaction: async (_, { transaction_details }) => {
		try {
			const { transaction_id, ...updates } = transaction_details;
			const existing_transaction = await Transaction.findById(
				transaction_details.transaction_id
			);

			if (!existing_transaction) {
				throw new Error("Transaction not found.");
			}
			const fieldsToUpdate = Object.keys(updates).reduce((acc, key) => {
				if (updates[key] !== existing_transaction[key]) {
					acc[key] = updates[key];
				}
				return acc;
			}, {});
			if (Object.keys(fieldsToUpdate).length === 0) {
				throw new Error("No changes detected in the transaction.");
			}
			const updatedTransaction = await Transaction.findByIdAndUpdate(
				transaction_id,
				{ $set: fieldsToUpdate }, // Only update the necessary fields
				{ new: true, useFindAndModify: false } // Return the updated document
			);

			if (!updatedTransaction) {
				throw new Error("Failed to update the transaction.");
			}

			return updatedTransaction;
		} catch (error) {
			console.error("Error in updateTransaction:", error);
			throw new Error("Failed to update transaction.");
		}
	},

	deleteTransaction: async (_, { transaction_id }) => {
		try {
			const existing_transaction =
				await Transaction.findById(transaction_id);
			if (!existing_transaction) {
				throw new Error("Transaction not found.");
			}

			const deletedTransaction =
				await Transaction.findByIdAndDelete(transaction_id);
			return deletedTransaction;
		} catch (error) {
			console.error("Error in deleteTransaction:", error);
			throw new Error("Failed to delete transaction.");
		}
	},
};

export const resolvers = { queries, mutations };
