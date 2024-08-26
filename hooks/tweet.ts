import { graphqlClient } from "@/clients/api";
import { CreateTweetContent } from "@/gql/graphql";
import { createTweetMutation } from "@/graphql/mutations/tweeet";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";



export const useCreateTweet = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateTweetContent) => {
      return graphqlClient.request(createTweetMutation, { payload });
    },
    onMutate: (payload) => toast.loading("Posting", { id: "1" }),

    onSuccess: async () => {
      await queryClient.invalidateQueries(["all-tweets"]),
        toast.success("Tweet posted successfully", { id: "1" });
    },
  });

  return mutation;
};



export const useGetAllTweets = () => {
  const query = useQuery({
    queryKey: ["all-tweets"],
    queryFn: () => graphqlClient.request(getAllTweetsQuery),
  });

  return { ...query, tweets: query.data?.getAllTweets };
};
