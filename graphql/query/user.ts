import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
  #graphql
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      profileImageURL
      email
      firstName
      lastName
      tweets {
        imageUrl
        id
        content
        author {
          id
          profileImageURL
        }
      }
    }
  }
`);

export const getUserByIDQuery = graphql(`
  #graphql
  query GetUserByID($id: ID!) {
    getUserByID(id: $id) {
      id
      firstName
      lastName
      email
      profileImageURL
      tweets {
        content
        imageUrl
        author {
          id
          firstName
          lastName
          profileImageURL
        }
      }
    }
  }
`);
