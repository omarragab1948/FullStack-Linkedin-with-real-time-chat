"use client";
import Image from "next/image";
import userImage from "@/public/images/user.svg";
import { useSelector } from "react-redux";
import Link from "next/link";
const LeftSide = () => {
  const userr = useSelector((state) => state.auth.user?.user);

  return (
    <div className="  relative dark:bg-darkbg md:sticky top-24 h-fit w-full  md:w-1/3 lg:w-1/4 mb-10 md:mr-6 border border-slate-300 dark:border-darkborder border-solid rounded-t-xl">
      <div className="text-center   overflow-hidden  rounded border-none">
        <Link href={`/home/profile/${userr?._id}`}>
          <div>
            {userr?.backgroundImage ? (
              <Image
                src={userr?.backgroundImage}
                alt="user"
                width={1500}
                height={1500}
                className="rounded-t-xl w-full h-32 mx-auto"
              />
            ) : (
              <div className="w-full h-32 bg-gradient-to-b from-slate-300 to-slate-50 dark:to-slate-500 rounded-t-xl"></div>
            )}
          </div>
          <div className="relative bottom-10  rounded-full ">
            <Image
              src={userr?.profileImage || userImage}
              alt="user"
              className="rounded-full w-20 h-20 mx-auto"
              width={1500}
              height={1500}
            />
          </div>
          <div className="font-semibold relative bottom-6 text-base leading-normal text-black dark:text-darkmaintext  opacity-90">
            <span>
              {userr?.firstName} {userr?.lastName}
            </span>
          </div>
          <div className="font-normal dark:text-darksecondtext relative bottom-6 text-md leading-snug mt-1">
            {userr?.title === "undefined" || userr?.title === ""
              ? ""
              : userr?.title}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LeftSide;
