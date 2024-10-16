import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
    query FetchTransactions {
        fetchTransactions {
            _id
            amount
            description
            mode
            category
            date
            location
        }
    }
`;

export const GET_TRANSACTION = gql`
    query fetchTransaction($id: ID!) {
        transaction(transactionId: $id) {
            t_id: transaction_id
            t_desc: description
            t_amount: amount
            t_date: date
            t_category: category
            t_mode: mode
            t_location: location
        }
    }
`;

export const GET_TRANSACTION_STAT = gql`
    query FetchTransactionStatistics {
        fetchTransactionStatistics {
            category
            amount
        }
    }
`;
