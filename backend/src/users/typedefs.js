export const typedefs = `#graphql
    enum Gender {
        Male
        Female
        Others
    }
    type User {
        id: ID!
        name: String!
        email: String!
        gender: Gender!
        phone: String
        profile_picture: String
    }
    type getUserResponse {
    authenticated: Boolean!
    user: User
    }
    input createUser{
        name:String!
        email:String!
        phone:String
        gender:Gender!
        password:String!
    }
    input loginUser{
        email:String!
        password:String!
    }
    type Query{
        ping:String!
        getUser:getUserResponse!
    }
    type Mutation{
        registerUser(user_details:createUser!): String!
        loginUser(user_details:loginUser!): String!
        logoutUser:String!
    }
`;
