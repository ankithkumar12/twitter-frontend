import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Tweet } from "@/gql/graphql";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser } from "@/hooks/user";
import { CiImageOn } from "react-icons/ci";

import { TwitterLayout } from "../components/Layout/TwitterLayout";

import FeedCard from "@/components/FeedCard";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery, getSignedURLQuery } from "@/graphql/query/tweet";
import toast from "react-hot-toast";
import axios from "axios";
import { headers } from "next/dist/client/components/headers";

interface ServerProps {
  tweets: Tweet[];
}

export default function Home(props: ServerProps) {
  const router = useRouter();
  const { mutate } = useCreateTweet();
  const { user } = useCurrentUser();

  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleInputFileChange = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();

      const file: File | null | undefined = input.files?.item(0);

      if (!file) return;

      console.log(file.name);
      console.log();

      const { getSignedURL } = await graphqlClient.request(getSignedURLQuery, {
        imageName: file.name,
        imageType: file.type.split("image/")[1],
      });

      if (!getSignedURL) {
        toast.error("Unable to communicate with backend");
        toast.loading("Try again after few seconds!");
      }

      toast.loading("Uploading", { id: "2" });
      await axios.put(getSignedURL, file, {
        headers: {
          "Content-type": file.type,
        },
      });
      toast.success("Uploading complete", { id: "2" });

      const url = new URL(getSignedURL);
      const fileLink = `${url.origin}${url.pathname}`;

      console.log(fileLink);

      setImageURL(fileLink);
    };
  }, []);

  const handleImageClick = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handlerFN = handleInputFileChange(input);

    input.addEventListener("change", handlerFN);

    input.click();
  }, [handleInputFileChange]);

  console.log(user);

  const handlePostCreation = useCallback(() => {
    mutate({
      content,
      imageUrl: imageURL,
    });

    const refreshData = async() => {
      await router.replace(router.asPath);
    };

    refreshData();
    
  }, [mutate, content, imageURL, router]);

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
              {imageURL != "" && (
                <Image
                  className="mt-2"
                  src={imageURL}
                  alt="uploaded-image"
                  height={400}
                  width={400}
                />
              )}
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
        {props.tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
        )}
      </TwitterLayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tweets = await graphqlClient.request(getAllTweetsQuery);

  return {
    props: {
      tweets: tweets.getAllTweets as Tweet[],
    },
  };
};
