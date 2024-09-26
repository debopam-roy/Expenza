import { gql } from '@apollo/client';

export const CREATE_TRANSACTION = gql`
    mutation Mutation($transactionDetails: CreateTransactionInput!) {
        createTransaction(transaction_details: $transactionDetails)
    }
`;