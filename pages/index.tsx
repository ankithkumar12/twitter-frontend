import { useCallback, useState } from "react";


import { Tweet } from "@/gql/graphql";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser } from "@/hooks/user";
import { CiImageOn } from "react-icons/ci";

import { TwitterLayout } from "../components/Layout/TwitterLayout";

import FeedCard from "@/components/FeedCard";
import Image from "next/image";



export default function Home() {
  const { tweets = [] } = useGetAllTweets();
  const { mutate } = useCreateTweet();
  const { user } = useCurrentUser();

  const [content, setContent] = useState("");

  const handleImageClick = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);

  console.log(user);

  const handlePostCreation = useCallback(() => {
    mutate({
      content,
    });
  }, [mutate, content]);

  return (
    <div>
      <TwitterLayout>
        <div className="input-card">
          <div className="grid grid-cols-12  border-t-[1px] p-2  border-gray-800">
            <div className="col-span-1 pt-2">
              {user?.profileImageURL ? (
                <Image
                  className="rounded-full"
                  src={user.profileImageURL}
                  alt="user-image"
                  height={35}
                  width={35}
                />
              ) : (
                <Image
                  className="rounded-full"
                  src={"/user-avatar.png"}
                  alt="user-image"
                  height={35}
                  width={35}
                />
              )}
            </div>
            <div className="col-span-11 mt-3 px-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="bg-transparent text-xl border-b border-gray-800 w-full resize-none overflow-auto"
                placeholder="What's happening?"
              ></textarea>
              <div className="flex justify-between text-lg">
                <CiImageOn
                  className="text-3xl mt-2 cursor-pointer"
                  onClick={handleImageClick}
                />
                <button
                  onClick={handlePostCreation}
                  className="bg-[#1d9bf0] rounded-full px-5 py-2 mt-2 cursor-pointer text-xs"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
        {tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
        )}
      </TwitterLayout>
    </div>
  );
}
