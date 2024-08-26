import { graphql } from "@/gql";

export const followUserMutation = graphql(`
  mutation Mutation($to: String) {
    followUser(to: $to)
  }
`);

export const unfollowUserMutation = graphql(`
  mutation UnfollowUser($to: String) {
    unfollowUser(to: $to)
  }
`);
