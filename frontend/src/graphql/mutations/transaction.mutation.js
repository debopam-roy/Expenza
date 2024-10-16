import { gql } from '@apollo/client';

export const CREATE_TRANSACTION = gql`
    mutation Mutation($transactionDetails: CreateTransactionInput!) {
        createTransaction(transaction_details: $transactionDetails) {
            _id
            amount
            description
            date
            mode
            category
            location
        }
    }
`;
export const UPDATE_TRANSACTION = gql`
    mutation Mutation($transactionDetails: UpdateTransaction!) {
        updateTransaction(transaction_details: $transactionDetails) {
            _id
            description
            amount
            mode
            category
            date
            location
        }
    }
`;
export const DELETE_TRANSACTION = gql`
    mutation Mutation($transactionId: ID!) {
        deleteTransaction(transaction_id: $transactionId) {
            _id
            amount
            description
            category
            mode
            date
            location
        }
    }
`;
