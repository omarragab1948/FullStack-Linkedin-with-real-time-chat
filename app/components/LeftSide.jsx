"use client";
import Image from "next/image";
import { BsFillBookmarkFill } from "react-icons/bs";
import user from "@/public/images/user.svg";
import share from "@/public/images/shared-image.jpg";
import { useSelector } from "react-redux";
import Link from "next/link";
const LeftSide = () => {
  const userr = useSelector((state) => state.auth.user?.user);

  return (
    <div className="left relative md:sticky top-24 h-fit w-full  md:w-1/3 lg:w-1/4 mb-10 md:mr-6 border border-slate-300 border-solid rounded-t-xl">
      <div className="text-center   overflow-hidden  rounded border-none">
        <Link href="/home/profile">
          <div>
            <Image
              src={userr?.backgroundImage}
              alt="user"
              width={1500}
              height={1500}
              className="rounded-t-xl w-full h-32 mx-auto"
            />
          </div>
          <div className="relative bottom-10  rounded-full ">
            <Image
              src={userr?.profileImage}
              alt="user"
              className="rounded-full w-20 h-20 mx-auto"
              width={1500}
              height={1500}
            />
          </div>
          <div className="font-semibold relative bottom-6 text-base leading-normal text-black  opacity-90">
            <span>
              {userr?.firstName} {userr?.lastName}
            </span>
          </div>
          <div className="font-normal relative bottom-6 text-md leading-snug mt-1">
            Front-End
          </div>
        </Link>
      </div>
      <div className="px-3">
        <div>
          <a className="flex justify-between ">
            <div className="flex flex-col text-start text-xs leading-snug">
              <span className=" dark:opacity-60 text-black ">Connections</span>
              <span className="text-black  opacity-90">Grow your network</span>
            </div>
            <span className=" text-black">10</span>
          </a>
        </div>
        <div className="item py-3  text-start">
          <span className="flex text-xs text-black  dark:opacity-90 items-center">
            <BsFillBookmarkFill className="mr-2 text-black  dark:opacity-60" />
            My Items
          </span>
        </div>
        <div className=" flex flex-col items-start">
          <a className="my-1">
            <span className="flex">Groups</span>
          </a>
          <div className="my-1 w-full">
            <span className="flex justify-between items-center">
              Events
              <svg
                className=" text-black"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                data-supported-dps="16x16"
                fill="currentColor"
                class="mercado-match"
                width="16"
                height="16"
                focusable="false"
              >
                <path d="M14 9H9v5H7V9H2V7h5V2h2v5h5z"></path>
              </svg>
            </span>
          </div>
          <a className="my-1">
            <span className="flex">Follow Hashtags</span>
          </a>
          <a>
            <span className=" dark:opacity-90 h-10 flex justify-center text-center items-center">
              Discover more
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
