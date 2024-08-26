import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { TwitterLayout } from "../components/Layout/TwitterLayout";
import { IoArrowBackOutline } from "react-icons/io5";
import { useCurrentUser } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import { divider } from "@nextui-org/react";
import { useRouter } from "next/router";
import { graphqlClient } from "@/clients/api";
import { getUserByIDQuery } from "@/graphql/query/user";
import toast from "react-hot-toast";
import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  followUserMutation,
  unfollowUserMutation,
} from "@/graphql/mutations/user";

interface ServerProps {
  user?: User;
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  console.log(router.query.id);

  const amIFollowing = useMemo(() => {
    if (!props.user) return false;
    return (
      (currentUser?.following?.findIndex((el) => el?.id === props.user?.id) ??
        -1) >= 0
    );
  }, [currentUser?.following, props.user]);

  const handleFollowUser = useCallback(async () => {
    if (!props.user?.id) return;

    await graphqlClient.request(followUserMutation, { to: props.user?.id });
    await queryClient.invalidateQueries(["curent-user"]);
  }, [props.user?.id, queryClient]);

  const handleUnfollowUser = useCallback(async () => {
    if (!props.user?.id) return;

    await graphqlClient.request(unfollowUserMutation, {
      to: props.user?.id,
    });
    await queryClient.invalidateQueries(["curent-user"]);
  }, [props.user?.id, queryClient]);

  return (
    <div>
      <TwitterLayout>
        <div className=" p-2 flex gap-2 items-center border-b border-slate-700">
          <nav>
            <Link href={"/"}>
              <IoArrowBackOutline className="text-3xl hover:bg-slate-700 rounded-full cursor-pointer" />
            </Link>
          </nav>
          <div>
            <h1 className="text-xl">{props.user?.firstName}</h1>
            <h3 className="text-xs text-slate-500">
              {props.user?.tweets?.length} Tweets
            </h3>
          </div>
        </div>

        <div className="p-3 border-b border-slate-700">
          {props.user && props.user?.profileImageURL && (
            <div>
              <Image
                src={props.user?.profileImageURL}
                alt="profile-image"
                height={150}
                width={150}
                className="rounded-full"
              />

              <div className="p-3">
                <div className="flex gap-1">
                  <h1 className="text-xl">{props.user.firstName} </h1>
                  <h1 className="text-xl">{props.user.lastName} </h1>
                </div>
                <h3 className="text-xs text-slate-500">{props.user.email}</h3>
              </div>

              <div className="flex px-3 justify-between items-center">
                <div className="flex gap-2  text-slate-500">
                  <h1 className="text-sm">
                    {props.user.followers?.length} Followers{" "}
                  </h1>
                  <h1 className="text-sm">
                    {props.user.following?.length} Following
                  </h1>
                </div>
                {currentUser?.id !== props.user?.id && (
                  <>
                    {amIFollowing ? (
                      <button
                        onClick={handleUnfollowUser}
                        className="bg-white text-black px-3 py-1 rounded-full text-sm"
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        onClick={handleFollowUser}
                        className="bg-white text-black px-3 py-1 rounded-full text-sm"
                      >
                        Follow
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {props.user && props.user.tweets && (
          <div>
            {props.user?.tweets?.map((tweet) => (
              <FeedCard data={tweet as Tweet} key={tweet!.id} />
            ))}
          </div>
        )}
      </TwitterLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const id = context.query.id as string | undefined;

  if (!id)
    return {
      notFound: true,
      props: {
        user: null,
      },
    };

  const userInfo = await graphqlClient.request(getUserByIDQuery, { id: id });
  if (!userInfo.getUserByID)
    return {
      notFound: true,
      props: {
        user: null,
      },
    };

  return {
    props: {
      user: userInfo.getUserByID as User,
    },
  };
};

export default UserProfilePage;
