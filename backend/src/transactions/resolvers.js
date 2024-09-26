import Transaction from "../models/Transactions.model.js";

const queries = {
	fetchTransactions: async () => {
		try {
			const transactions = await Transaction.find({})
				.populate("us`er_id")
				.exec();
			return transactions;
		} catch (error) {
			console.error("Error in fetchTransactions:", error);
			throw new Error("Failed to fetch transactions.");
		}
	},
	fetchTransaction: async (transaction_id) => {
		try {
			const transaction = await Transaction.findById(transaction_id)
				.populate("user_id")
				.exec();
			return transaction;
		} catch (error) {
			console.error("Error in fetchTransactions:", error);
			throw new Error("Failed to fetch transactions.");
		}
	},
};

const mutations = {
createTransaction: async (_, { transaction_details }, context) => {
    try {
		const user_id = context.headers.user_id || '';
		if (user_id === '') {
			throw new Error('Unauthorized');
		}
		const newTransaction = await Transaction.create({
			user_id,
            ...transaction_details,
        }).select("-user_id");
        return newTransaction;
    } catch (error) {
        console.error("Error in createTransaction:", error);
        throw new Error("Failed to create transaction.");
    }
},


	updateTransaction: async (_, { transaction_details }, context) => {
		try {
			const user_id = context.headers.user_id || "";
			if (user_id === "") {
				throw new Error("Unauthorized");
			}

			const { transaction_id, ...updates } = transaction_details;
			const existing_transaction = await Transaction.findById(
				transaction_id
			);

			if (!existing_transaction) {
				throw new Error("Transaction not found.");
			}

			// Compare and filter unchanged fields
			const fieldsToUpdate = Object.keys(updates).reduce((acc, key) => {
				if (updates[key] !== existing_transaction[key]) {
					acc[key] = updates[key];
				}
				return acc;
			}, {});

			if (Object.keys(fieldsToUpdate).length === 0) {
				throw new Error("No changes detected in the transaction.");
			}

			const new_Transaction = await Transaction.findByIdAndUpdate(
				transaction_id,
				{ $set: fieldsToUpdate },
				{ new: true }
			);
			return new_Transaction;
		} catch (error) {
			console.error("Error in updateTransaction:", error);
			throw new Error("Failed to update transaction.");
		}
	},

	deleteTransaction: async (_, { transaction_id }, context) => {
		try {
			const user_id = context.headers.user_id || "";
			if (user_id === "") {
				throw new Error("Unauthorized");
			}

			const existing_transaction =
				await Transaction.findById(transaction_id);
			if (!existing_transaction) {
				throw new Error("Transaction not found.");
			}

			const new_Transaction = await Transaction.findByIdAndDelete(transaction_id);
			return new_Transaction;
		} catch (error) {
			console.error("Error in deleteTransaction:", error);
			throw new Error("Failed to delete transaction.");
		}
	},
};

export const resolvers = { queries, mutations };
