import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMessageCircle } from "react-icons/fi";
import { LiaRetweetSolid } from "react-icons/lia";
import { IoIosHeartEmpty } from "react-icons/io";
import { CgLoadbarSound } from "react-icons/cg";
import { CiBookmark } from "react-icons/ci";
import { BsUpload } from "react-icons/bs";
import { Tweet } from "@/gql/graphql";

interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data } = props;

  return (
    <div>
      <div className="grid grid-cols-12  border-t-[1px] p-2  border-gray-800">
        <div className="col-span-1 ">
          {data.author?.profileImageURL && (
            <Image
              className="rounded-full"
              src={data.author?.profileImageURL}
              alt="User-avatar"
              width={35}
              height={35}
            ></Image>
          )}
        </div>
        <div className="col-span-11 px-2">
          <Link href={`./${data.author?.id}`}>
            <h5 className="hover:underline">
              {data.author?.firstName} {data.author?.lastName}
            </h5>
          </Link>
          <p>{data.content}</p>
          {data.imageUrl && (
            <Image
              className="mt-2"
              src={data.imageUrl}
              alt="image"
              height={400}
              width={400}
            />
          )}
          <div className="flex items-center justify-between mt-2 mb-2">
            <div className="hover:bg-sky-950 rounded-full cursor-pointer">
              <FiMessageCircle className=" text-lg " />
            </div>

            <div className="cursor-pointer ">
              <LiaRetweetSolid className="text-lg" />
            </div>

            <div className=" cursor-pointer">
              <IoIosHeartEmpty className=" text-lg" />
            </div>

            <div className="cursor-pointer ">
              <CgLoadbarSound className="text-lg" />
            </div>

            <span className="flex gap-2">
              <div className=" cursor-pointer ">
                <CiBookmark className=" text-lg" />
              </div>
              <div className="cursor-pointer ">
                <BsUpload className="text-lg" />
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
