import { graphqlClient } from "@/clients/api";
import { getCurrentUserQuery } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["curent-user"],
    queryFn: async() =>await graphqlClient.request(getCurrentUserQuery),
  });
  

  console.log("From DB")
  console.log(query.data?.getCurrentUser)

  return { ...query, user: query.data?.getCurrentUser };
};
