import { graphql } from "@/gql";

export const createTweetMutation = graphql(`
  mutation CreateTweet($payload: CreateTweetContent!) {
    createTweet(payload: $payload) {
      id
    }
  }
`);
