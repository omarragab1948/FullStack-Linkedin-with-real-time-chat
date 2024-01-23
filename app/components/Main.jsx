"use client";
import { SlLike } from "react-icons/sl";
import { BiRepost } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";
import PostModel from "./PostModel";
import { useEffect, useState } from "react";
import {
  commentPost,
  getAllPosts,
  likePost,
  sharePost,
} from "../services/apiHandler";
import { useSelector } from "react-redux";
import CommentPopup from "./CommentPopup";
import userImage from "/public/images/user.svg";

const Main = () => {
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const user = useSelector((state) => state.auth.user?.user);
  const [showComment, setShowComment] = useState(false);
  const [postToComment, setPostToComment] = useState(null);
  const [content, setContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [postToShowComments, setPostToShowComments] = useState(null);
  const [type, setType] = useState("");

  const getData = async () => {
    setSpinner(true);
    try {
      const res = await getAllPosts();

      if (res.status === 200) {
        setPosts(res.data);
        setSpinner(false);
      }
      if (res.data === undefined) {
        setSpinner(false);
      }
    } catch (err) {
      setSpinner(false);

      throw err;
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };
  const handlePostAdded = () => {
    getData();
  };

  useEffect(() => {
    getData();
  }, []);
  const handelLike = async (id) => {
    const like = {
      post: id,
      userImage: user?.profileImage,
      userName: `${user?.firstName} ${user?.lastName && user?.lastName}`,
    };
    try {
      const res = await likePost(like);
    } catch (err) {
      throw err;
    }
    getData();
  };
  const handleComment = async (postId) => {
    console.log(user?.profileImage);
    try {
      const res = await commentPost({
        post: postId,
        userImage: user?.profileImage,
        userName: `${user?.firstName} ${user?.lastName && user?.lastName}`,
        content: content,
      });
      console.log(res);
      // Handle the response if needed
      getData();
      setContent("");
    } catch (err) {
      // Handle the error
      console.error(err);
    }

    // Close the comment modal
    setShowComment(false);
  };
  const handleShowCommentModal = (post, condition) => {
    setShowComment(condition);
    setPostToComment(post);
  };
  const handleShowComments = (post, type) => {
    setShowComments(true);
    setPostToShowComments(post);
    setType(type);
  };
  const handleShare = async (post) => {
    setSpinner(true);
    const formData = new FormData();
    formData.set("content", post?.content);
    formData.set("image", post?.image);
    formData.set("originalUserId", post?.autherId);
    formData.set("originalUserFirstName", post?.firstName);
    formData.set("originalUserLastName", post?.lastName);
    formData.set("originalUserImage", post?.autherImage);
    formData.set("originalUserId", post?.autherId);
    formData.set("originalUserTitle", post?.autherTitle);
    formData.set("originalDate", post?.date);

    const res = await sharePost(formData);
    if (res.status === 201) {
      getData();
      setSpinner(false);
    }
  };
  return (
    <div className="w-full mb-40 md:w-4/5 lg:w-1/2 flex relative top-[73px] flex-col mr-4  text-center overflow-hidden rounded-md  border-0">
      <div className=" border border-solid  dark:border-darkborder dark:bg-darkbg border-slate-300 rounded pt-2">
        <div className=" px-2 my-6 ">
          <div className="flex justify-around my-3">
            <Image
              src={user?.profileImage || userImage}
              alt="user"
              className="rounded-full w-14 h-14 mr-2"
              width={1500}
              height={1500}
            />

            <button
              onClick={() => setShow(true)}
              className="w-full text-black dark:text-darkmaintext opacity-70 text-left px-3 border-solid border border-slate-400 rounded-full"
            >
              Start a Post
            </button>
          </div>
        </div>
      </div>

      {spinner && (
        <div
          className={`border-4 my-2 border-solid mx-auto ${
            spinner ? "opacity-1" : "opacity-0"
          } border-gray-400 border-t-blue-500 rounded-full w-8 h-8 animate-spin`}
        ></div>
      )}
      {posts?.length > 0 &&
        posts.map((post, index) => (
          <div
            key={index}
            className="mt-3  dark:bg-darkbg p-2  rounded border border-solid dark:border-darkborder border-slate-300"
          >
            <div className="p-1">
              <div className="flex justify-between relative">
                {!post?.repost ? (
                  <Link
                    href={`/home/profile/${post?.autherId}`}
                    className="flex items-center"
                  >
                    <Image
                      src={`${post?.autherImage || userImage}`}
                      className="w-12 h-12 rounded-full"
                      width={1500}
                      height={1500}
                      alt="post"
                    />
                    <div className="spans flex flex-col ml-2 text-xs dark:text-darkmaintext">
                      <span className="font-bold flex">
                        {post.firstName}
                        <span className="ml-1">{post.lastName}</span>
                      </span>
                      <span className="opacity-70 font-semibold dark:text-darksecondtext">
                        {post?.autherTitle === "undefined"
                          ? ""
                          : post?.autherTitle}
                      </span>

                      <span className="font-semibold opacity-70 dark:text-darksecondtext">
                        {formatDate(post?.date)}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link href="" className="flex flex-col justify-center w-full">
                    <div className="mb-2 pb-2 flex items-center border-b dark:border-darkborder border-slate-300 border-solid w-full">
                      <Image
                        src={
                          post?.autherImage === "" ||
                          post?.autherImage === "undefined"
                            ? userImage
                            : post?.autherImage
                        }
                        className="w-8 h-8 rounded-full"
                        width={1500}
                        height={1500}
                        alt="post"
                      />
                      <div className="spans flex flex-col ml-2 text-xs ">
                        <span className="font-bold dark:text-darkmaintext">
                          <span className="font-bold flex">
                            {post.firstName}
                            <span className="ml-1">{post.lastName}</span>
                          </span>
                          <span className=" ml-1 font-light">
                            reposted this
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex ">
                      <Image
                        src={post?.repost?.originalUserImage || userImage}
                        className="w-12 h-12 rounded-full"
                        width={1500}
                        height={1500}
                        alt="post"
                      />
                      <div className="spans flex flex-col ml-2 text-xs ">
                        <span className="font-bold dark:text-darkmaintext">
                          {post?.repost?.originalUserFirstName}
                          <span className="ml-1">
                            {" "}
                            {post?.repost?.originalUserLastName}
                          </span>
                        </span>
                        <span className="opacity-70 font-semibold dark:text-darksecondtext">
                          {post?.repost?.originalUserTitle === "undefined"
                            ? ""
                            : post?.repost?.originalUserTitle}
                        </span>

                        <span className="font-semibold opacity-70 dark:text-darksecondtext">
                          {formatDate(post?.repost?.originalDate)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
              <div className="description text-left my-6 text-sm dark:text-darkmaintext ml-4 ">
                {post?.content}
              </div>
              {post?.image &&
                post?.image !== "undefined" &&
                post?.image !== "" && (
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
                {post?.likes?.length > 0 ? (
                  <li>
                    <button
                      onClick={() => handleShowComments(post, "likes")}
                      className="flex mr-2 py-1 px-2 items-center"
                    >
                      <img src="https://static-exp1.licdn.com/sc/h/2uxqgankkcxm505qn812vqyss" />
                      <span className="text-black opacity-70 dark:text-darksecondtext">
                        {post?.likes?.length}
                      </span>
                    </button>
                  </li>
                ) : (
                  <span className="dark:text-darksecondtext">No likes yet</span>
                )}
                {post?.comments?.length > 0 ? (
                  <li>
                    <button
                      onClick={() => handleShowComments(post, "comments")}
                      className="text-black opacity-70 dark:text-darksecondtext"
                    >
                      {post?.comments?.length} comments
                    </button>
                  </li>
                ) : (
                  <span className="dark:text-darksecondtext">
                    No comments yet
                  </span>
                )}
              </ul>
              <div className="my-1  flex items-center justify-around">
                <button
                  onClick={() => handelLike(post?._id)}
                  className="flex flex-col justify-center items-center rounded-md  px-6 py-2 dark:text-white hover:bg-blue-600 hover:text-white duration-300"
                >
                  <SlLike className="w-5 h-5 items-center " />
                </button>
                <button
                  onClick={() => handleShowCommentModal(post, !showComment)}
                  className="flex flex-col justify-center rounded-md  px-6 py-2 hover:bg-blue-600 dark:text-white hover:text-white duration-300"
                >
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
                </button>

                <button
                  onClick={() => handleShare(post)}
                  className="flex flex-col justify-center rounded-md dark:text-white  px-6 py-2 hover:bg-blue-600 hover:text-white duration-300 "
                >
                  <BiRepost className="w-6 h-6 items-center" />
                </button>
              </div>
              {showComment && postToComment?._id === post?._id && (
                <div className="flex flex-col items-center relative justify-between px-2">
                  <div className=" flex items-center w-full">
                    <div>
                      <Image
                        src={user?.profileImage || userImage}
                        alt="article"
                        width={1500}
                        height={1500}
                        className=" h-14 w-14 rounded-full"
                      />
                    </div>
                    <div className="py-2 px-3  flex w-11/12 flex-col justify-between  items-center">
                      <div className="py-2 px-3 h-full w-full">
                        <input
                          id="comment"
                          name="comment"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Write your comment..."
                          className="p-2 w-full rounded-lg focus:outline-none border border-solid border-black bg-white"
                        />
                      </div>
                    </div>
                  </div>
                  {content && (
                    <button
                      className={`py-1 rounded-full px-4 mr-4 font-bold ${
                        !content ? "" : "bg-blue-500 text-white "
                      }`}
                      type="button"
                      onClick={() => handleComment(post?._id)}
                    >
                      Post
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      {!spinner && posts?.length === 0 && (
        <div className="mt-3 bg-main-dark-bg p-2 rounded border border-solid border-slate-300">
          <div className="text-center">
            <span className="text-gray-500">No posts found</span>
          </div>
        </div>
      )}
      <PostModel
        show={show}
        setShow={setShow}
        handlePostAdded={handlePostAdded}
      />
      {showComments && (
        <CommentPopup
          post={postToShowComments}
          // handleComment={handleComment}
          show={setShowComments}
          type={type}
          setType={setType}
        />
      )}
    </div>
  );
};

export default Main;
