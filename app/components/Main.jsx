"use client";
import { SlLike } from "react-icons/sl";
import { BiRepost } from "react-icons/bi";
import Link from "next/link";
import article from "@/public/images/shared-image.jpg";
import Image from "next/image";
import PostModel from "./PostModel";
import { useEffect, useState } from "react";
import { getAllPosts } from "../services/apiHandler";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../rtk/authSlice";
import { fetchPosts } from "../rtk/postsSlice";
const Main = () => {
  const [show, setShow] = useState(false);
  // const [posts, setPosts] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const user = useSelector((state) => state.auth.user?.user);

  const getData = async () => {
    setSpinner(true);
    try {
      const res = await getAllPosts();
      if (res.status === 200) {
        // setPosts(res.data);
        console.log(res);
        setSpinner(false);
      }
    } catch (err) {
      throw err;
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };
  // const handlePostAdded = () => {
  //   // const local =
  //   //   typeof window !== "undefined" && localStorage.getItem("posts");

  //   // setPosts(JSON.parse(local));
  // };

  // const local = typeof window !== "undefined" && localStorage.getItem("posts");
  // useEffect(() => {
  //   // setPosts(JSON.parse(local));
  //   getData();
  // }, []);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts?.posts);
  console.log(posts);
  useEffect(() => {
    dispatch(fetchPosts());
    // setPosts(postsData?.posts);
  }, [dispatch]);
  return (
    <div className="w-full md:w-[80%] lg:w-1/2 flex relative top-[73px] flex-col mr-4 mb-3 text-center overflow-hidden rounded-md  border-0">
      <div className=" border border-solid border-slate-300 rounded pt-2">
        <div className=" px-2 my-2 ">
          <div className="flex my-3">
            <Image
              src={user?.profileImage}
              alt="user"
              className="rounded-full w-14 h-14 mr-2"
              width={1500}
              height={1500}
            />

            <button
              onClick={() => setShow(true)}
              className="w-full text-black opacity-70 text-left px-3 border-solid border border-slate-400 rounded-full"
            >
              Start a Post
            </button>
          </div>
          <div className="my-4 text-black opacity-70 flex justify-between mx-auto items-center w-3/4">
            <button className="flex flex-col justify-center items-center">
              <img src="/images/photo-icon.svg" alt="photo" />
              <span>Photo</span>
            </button>
            <button className="flex flex-col justify-center items-center">
              <img src="/images/video-icon.svg" alt="video" />
              <span>Video</span>
            </button>
            <button className="flex flex-col justify-center items-center">
              <img src="/images/event-icon.svg" alt="event" />
              <span>Event</span>
            </button>
            <button className="flex flex-col justify-center items-center">
              <img src="/images/article-icon.svg" alt="article" />
              <span>Write article</span>
            </button>
          </div>
        </div>
      </div>
      {/* {loading ? (
        <div className="flex justify-center my-2">
          <RotatingLines
            strokeColor="#0a66c2"
            strokeWidth="4"
            animationDuration="0.75"
            width="50"
            visible={true}
          />
        </div>
      ) : (
        ""
      )} */}
      {spinner && (
        <div
          className={`border-4 my-2 border-solid mx-auto ${
            spinner ? "opacity-1" : "opacity-0"
          } border-gray-400 border-t-blue-500 rounded-full w-8 h-8 animate-spin`}
        ></div>
      )}
      {posts?.length > 0 ? (
        posts.map((post, index) => (
          <div
            key={index}
            className="mt-3  bg-main-dark-bg p-2  rounded border border-solid border-slate-300"
          >
            <div className="p-3">
              <div className="flex justify-between relative">
                <Link href="" className="flex items-center">
                  <Image
                    src={`${post?.autherImage || "/images/user.svg"}`}
                    className="w-12 h-12 rounded-full"
                    width={1500}
                    height={1500}
                    alt="post"
                  />
                  <div className="spans flex flex-col ml-2 text-xs ">
                    <span className="font-bold">
                      {post.firstName} {post.lastName}
                    </span>
                    <span className="opacity-70 font-semibold">
                      {post?.autherTitle}
                    </span>

                    <span className="font-semibold opacity-70">
                      {formatDate(post?.date)}
                    </span>
                  </div>
                </Link>
                <button className="my-auto border-0 absolute bottom-9 right-px text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    data-supported-dps="24x24"
                    fill="currentColor"
                    class="mercado-match"
                    width="24"
                    height="24"
                    focusable="false"
                  >
                    <path d="M14 12a2 2 0 11-2-2 2 2 0 012 2zM4 10a2 2 0 102 2 2 2 0 00-2-2zm16 0a2 2 0 102 2 2 2 0 00-2-2z"></path>
                  </svg>
                </button>
              </div>
              <div className="description text-left my-2 text-sm  ">
                {post?.content}
              </div>
              {post?.image && (
                <div>
                  <Image
                    src={post?.image}
                    alt="article"
                    width={1000}
                    height={1000}
                    className="mx-auto h-96"
                  />
                </div>
              )}
              <ul className="flex justify-between items-center my-2">
                <li>
                  <button className="flex mr-2 py-1 px-2 items-center">
                    <img src="https://static-exp1.licdn.com/sc/h/2uxqgankkcxm505qn812vqyss" />
                    <span className="text-black opacity-70">
                      {post?.reactions?.length}
                    </span>
                  </button>
                </li>
                <li>
                  <a className="text-black opacity-70">
                    {post?.comments?.length} comments
                  </a>
                </li>
              </ul>
              <div className="my-4 flex items-center justify-around">
                <button className="flex flex-col justify-center items-center opacity-70">
                  <SlLike className="w-5 h-5 items-center" />
                  <span className="opacity-70">Like</span>
                </button>
                <button className="flex flex-col justify-center items-center opacity-70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    data-supported-dps="24x24"
                    fill="currentColor"
                    class="mercado-match"
                    width="24"
                    height="24"
                    focusable="false"
                  >
                    <path d="M7 9h10v1H7zm0 4h7v-1H7zm16-2a6.78 6.78 0 01-2.84 5.61L12 22v-4H8A7 7 0 018 4h8a7 7 0 017 7zm-2 0a5 5 0 00-5-5H8a5 5 0 000 10h6v2.28L19 15a4.79 4.79 0 002-4z"></path>
                  </svg>
                  <span className="opacity-70">Comment</span>
                </button>
                <button className="flex flex-col justify-center items-center opacity-70">
                  <BiRepost className="w-6 h-6 items-center" />
                  <span className="opacity-70 h-6 flex items-center">
                    Share
                  </span>
                </button>
                <button className="flex flex-col justify-center items-center opacity-70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    data-supported-dps="24x24"
                    fill="currentColor"
                    class="mercado-match"
                    width="24"
                    height="24"
                    focusable="false"
                  >
                    <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
                  </svg>
                  <span className="">Send</span>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="mt-3 bg-main-dark-bg p-2 rounded border border-solid border-slate-300">
          <div className="text-center">
            <span className="text-gray-500">No posts found</span>
          </div>
        </div>
      )}
      <PostModel show={show} setShow={setShow} handlePostAdded={getData} />
    </div>
  );
};

export default Main;
