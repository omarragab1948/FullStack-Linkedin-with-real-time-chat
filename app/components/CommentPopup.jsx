import Image from "next/image";
import { IoCloseSharp } from "react-icons/io5";
import userImage from "/public/images/user.svg";

const CommentPopup = ({ post, show, type, setType }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="menu-container dark:bg-darkbg bg-white relative flex flex-col justify-between rounded-lg overflow-hidden w-11/12 md:w-1/3  ">
        <button
          onClick={() => show(false)}
          className="text-2xl absolute top-2 right-2 dark:text-darkmaintext"
        >
          <IoCloseSharp />
        </button>
        <div className="mt-3  bg-main-dark-bg p-2  ">
          <div className="p-1">
            <div className="mb-4  py-4">
              <div className="flex justify-between relative">
                <div href="" className="flex items-center">
                  <Image
                    src={`${post?.autherImage || "/images/user.svg"}`}
                    className="w-12 h-12 rounded-full"
                    width={1500}
                    height={1500}
                    alt="post"
                  />
                  <div className="spans flex flex-col dark:text-darkmaintext ml-2 text-xs ">
                    <span className="font-bold">
                      {post.firstName} {post.lastName}
                    </span>
                    <span className="opacity-70 dark:text-darksecondtext font-semibold">
                      {post?.autherTitle}
                    </span>

                    <span className="font-semibold dark:text-darksecondtext opacity-70">
                      {formatDate(post?.date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="description text-left ml-2 my-4 text-sm dark:text-darkmaintext ">
                {post?.content}
              </div>
              {post?.image && (
                <div>
                  <Image
                    src={post?.image}
                    alt="article"
                    width={1000}
                    height={1000}
                    className="mx-auto h-64"
                  />
                </div>
              )}
              <ul className="flex justify-between items-center my-2">
                <li>
                  <button
                    onClick={() => setType("likes")}
                    className="flex mr-2 py-1 px-2 items-center"
                  >
                    <img src="https://static-exp1.licdn.com/sc/h/2uxqgankkcxm505qn812vqyss" />
                    <span className="text-black opacity-70 dark:text-darksecondtext">
                      {post?.likes?.length}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setType("comments")}
                    className="text-black opacity-70 dark:text-darksecondtext"
                  >
                    {post?.comments?.length} comments
                  </button>
                </li>
              </ul>
            </div>
            <div className="overflow-auto h-52">
              {type === "comments" &&
                post?.comments?.map((comment) => (
                  <div
                    key={comment?._id}
                    className="flex flex-col px-3 items-start my-4 dark:bg-slate-800 p-4 rounded-md"
                  >
                    <div className="flex items-center">
                      <Image
                        src={comment?.userImage || userImage}
                        alt="post"
                        width={1500}
                        height={1500}
                        className=" h-14 w-14 rounded-full"
                      />
                      <span className="font-bold ml-3 dark:text-darksecondtext">
                        {comment?.userName}
                      </span>
                    </div>
                    <div className="flex flex-col ml-3 my-4 dark:text-darksecondtext justify-between items-center ">
                      <p>{comment?.content}</p>
                    </div>
                  </div>
                ))}
              {type === "likes" &&
                post?.likes?.map((like) => (
                  <div
                    key={like?._id}
                    className="flex dark:text-darksecondtext justify-between px-3 items-center my-2"
                  >
                    <div className="flex items-center">
                      <Image
                        src={like?.userImage || userImage}
                        alt="post"
                        width={1500}
                        height={1500}
                        className=" h-14 w-14 rounded-full mr-3"
                      />
                      <span>{like?.userName}</span>
                    </div>
                    <img src="https://static-exp1.licdn.com/sc/h/2uxqgankkcxm505qn812vqyss" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentPopup;
