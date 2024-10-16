export const typedefs = `#graphql
    enum Payment_Mode {
        Cash
        Card
        Upi
    }

    enum Categories {
        Savings
        Investment
        Expense
    }

    type Transaction {
        _id:ID!
        amount: Float!
        description: String!
        date: String!
        mode: Payment_Mode
        category: Categories
        location: String
    }
    type TransactionStatistics{
        category:String!
        amount:Float!
    }

    input CreateTransactionInput {
        amount: Float!
        description: String!
        mode: Payment_Mode! 
        category: Categories!
        date: String!
        location: String
    }

    input UpdateTransaction{
        transaction_id: ID!
        amount: Float!
        description: String!
        mode: Payment_Mode! 
        category: Categories!
        date: String!
        location: String
    }

    type Query {
        fetchTransactions: [Transaction!]
        fetchTransaction(transaction_id: ID!): Transaction!
        fetchTransactionStatistics:[TransactionStatistics!]
    }

    type Mutation {
        createTransaction(transaction_details: CreateTransactionInput!): Transaction!,
        updateTransaction(transaction_details: UpdateTransaction!):Transaction!,
        deleteTransaction(transaction_id: ID!): Transaction!
    }
`;
