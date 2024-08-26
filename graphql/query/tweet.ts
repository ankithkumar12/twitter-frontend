import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
  #graphql
  query GetAllTweets {
    getAllTweets {
      id
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
`);

export const getSignedURLQuery = graphql(`
  #graphql
  query Query($imageType: String!, $imageName: String!) {
    getSignedURL(imageType: $imageType, imageName: $imageName)
  }
`);
