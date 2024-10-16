import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
    mutation RegisterUser($userDetails: createUser!) {
        registerUser(user_details: $userDetails)
    }
`;

export const LOGIN_USER = gql`
    mutation LoginUser($userDetails: loginUser!) {
        loginUser(user_details: $userDetails)
    }
`;

export const LOGOUT_USER = gql`
    mutation logoutUser {
        logoutUser
    }
`;
