import Image from "next/image";
import { IoCloseSharp } from "react-icons/io5";
import userImage from "/public/images/user.svg";

const LikesPopup = ({ post, handleComment, show }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="menu-container bg-white relative flex flex-col justify-between rounded-lg overflow-hidden w-11/12 md:w-1/2 h-3/5 ">
        <button
          onClick={() => show(false)}
          className="text-2xl absolute top-2 right-2"
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
                </div>
              </div>
              <div className="description text-left ml-2 my-2 text-sm  ">
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
                      {post?.likes?.length}
                    </span>
                  </button>
                </li>
                <li>
                  <a className="text-black opacity-70">
                    {post?.comments?.length} comments
                  </a>
                </li>
              </ul>
            </div>
            <div className="overflow-auto min-h-52">
              {post?.comments?.map((comment) => (
                <div
                  key={comment?._id}
                  className="flex justify-between items-center my-2"
                >
                  <Image
                    src={comment?.userImage || userImage}
                    alt="post"
                    width={1500}
                    height={1500}
                    className=" h-14 w-14 rounded-full"
                  />
                  <p>{post?.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikesPopup;
