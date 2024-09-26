import { gql } from '@apollo/client';

export const ping_pong = gql`
    query Query {
        ping
    }
`;

export const GET_TRANSACTIONS = gql`
    query FetchTransactions {
        fetchTransactions {
            amount
            description
            date
            mode
            category
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
