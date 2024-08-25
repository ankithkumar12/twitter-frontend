// import React from "react";
// import Image from "next/image";
// import { BiMessageRounded, BiUpload } from "react-icons/bi";
// import { FaRetweet } from "react-icons/fa";
// import { AiOutlineHeart } from "react-icons/ai";

// const FeedCard: React.FC = () => {
//   return (
//     <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
//       <div className="grid grid-cols-12 gap-3">
//         <div className="col-span-1">
//           <Image
//             src="https://avatars.githubusercontent.com/u/44976328?v=4"
//             alt="user-image"
//             height={50}
//             width={50}
//           />
//         </div>
//         <div className="col-span-11">
//           <h5>Piyush Garg</h5>
//           <p>
//             Is it just me or everyone else? Do you feel the code quality
//             decrease as the project size increases? Just refactored a lot of bad
//             code ✨ #codinglife
//           </p>
//           <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
//             <div>
//               <BiMessageRounded />
//             </div>
//             <div>
//               <FaRetweet />
//             </div>
//             <div>
//               <AiOutlineHeart />
//             </div>
//             <div>
//               <BiUpload />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeedCard;




import React from "react";
import Image from "next/image";
import { FiMessageCircle } from "react-icons/fi";
import { LiaRetweetSolid } from "react-icons/lia";
import { IoIosHeartEmpty } from "react-icons/io";
import { CgLoadbarSound } from "react-icons/cg";
import { CiBookmark } from "react-icons/ci";
import { BsUpload } from "react-icons/bs";
import { Tweet } from "@/gql/graphql";


interface FeedCardProps{
  data:Tweet
}

const FeedCard: React.FC<FeedCardProps> = (props) => {

  const {data}=props
  
  return (
    <div>
      <div className="grid grid-cols-12  border-t-[1px] p-2  border-gray-800">
        <div className="col-span-1 ">
          {data.author?.profileImageURL && <Image className="rounded-full"
            src={data.author?.profileImageURL}
            alt="User-avatar"
            width={35}
            height={35}
          ></Image>}
        </div>
        <div className="col-span-11 px-2">
          <h5>Ankith Kumar</h5>
          <p>
            {data.content}
          </p>
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
