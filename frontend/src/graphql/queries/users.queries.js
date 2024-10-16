import { gql } from '@apollo/client';

export const PING_PONG = gql`
    query Query {
        ping
    }
`;

export const GET_USER = gql`
    query GetUser {
        getUser {
            authenticated
            user {
                id
                name
                email
                phone
                gender
                profile_picture
            }
        }
    }
`;
