import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo } from "react";
import { BsPeople } from "react-icons/bs";
import { CiCircleMore, CiMail, CiUser } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { GoBell } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import Image from "next/image";
import Link from "next/link";

interface TwitterLayoutProps {
  children: React.ReactNode;
}

export const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  interface TwitterSideBarItem {
    title: String;
    icon: React.ReactNode;
    link: string;
  }

  const sideBarItems: TwitterSideBarItem[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <FaXTwitter size={20} />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <IoSearchOutline />,
        link: "/",
      },
      {
        title: "Notifications",
        icon: <GoBell />,
        link: "/",
      },
      {
        title: "Messages",
        icon: <CiMail />,
        link: "/",
      },
      {
        title: "Communities",
        icon: <BsPeople />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <CiUser />,
        link: `/${user?.id}`,
      },
      {
        title: "More",
        icon: <CiCircleMore />,
        link: "/",
      },
    ],
    [user?.id]
  );

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google token not found`);
      console.log("here it is");
      console.log(googleToken);

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("Verified Success");

      console.log("verifyGoogleToken");
      console.log(verifyGoogleToken);

      if (verifyGoogleToken)
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);

      await queryClient.invalidateQueries(["curent-user"]);
    },
    [queryClient]
  );

  return (
    <div>
      <div>
        <div className="grid grid-cols-12 h-screen w-screen sm:px-12">
          <div className=" col-span-1 sm:col-span-2 md:col-span-3">
            <div className="mt-1  hover:bg-gray-800 rounded-full w-fit sm:ml-3">
              <FaXTwitter className="text-5xl p-2 object-contain cursor-pointer transition-all" />
            </div>

            <div className="icon-List   sm:px-2  lg:px-4 mt-4 font-normal lg:text-2xl ">
              <ul>
                {sideBarItems.map((item, index) => (
                  <div
                    key={index}
                    className=" hover:bg-gray-800 rounded-full w-fit  mt-2"
                  >
                    <li className="">
                      <Link
                        href={item.link}
                        className="flex gap-2 justify-start items-center mr-4 ml-2 py-2 cursor-pointer transition-all"
                      >
                        <span>{item.icon}</span>
                        <span className="hidden md:block">{item.title}</span>
                      </Link>
                    </li>
                  </div>
                ))}
              </ul>

              <button className="hidden md:block bg-[#1d9bf0] rounded-full  md:px-10 lg:px-20 py-2 mt-2 cursor-pointer">
                Post
              </button>

              {user && (
                <div className="absolute bottom-5 flex gap-2 items-center  cursor-pointer hover:bg-slate-800 sm:px-3 py-2 rounded-full overflow-clip">
                  {user && user.profileImageURL! && (
                    <Image
                      className="rounded-full"
                      src={user?.profileImageURL}
                      alt="user-image"
                      height={40}
                      width={40}
                    />
                  )}
                  <div>
                    <div className="text-xs  lg:text-base  overflow-hidden">
                      <p className="overflow-hidden hidden  lg:block w-[125px]">
                        {user.firstName}
                      </p>
                      <p className="overflow-hidden hidden  lg:block w-[125px]">
                        {user.lastName}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-11 sm:col-span-10 md:col-span-6  border-l-[1px] border-r-[1px] h-screen overflow-scroll scrollbar-hide border-gray-800">
            {props.children}
          </div>

          <div className="col-span-0 sm:col-span-2 md:col-span-3  p-5">
            {!user && (
              <div className="p-3  bg-slate-700 rounded-lg">
                <h1 className="my-2 text-2xl">New to Twitter?</h1>
                <GoogleLogin onSuccess={handleLoginWithGoogle} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterLayout;
