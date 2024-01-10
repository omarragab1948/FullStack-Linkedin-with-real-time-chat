"use client";
import { useEffect, useState } from "react";
import LeftSide from "../components/LeftSide";
import Main from "../components/Main";
import RightSide from "../components/RightSide";
import { getAllPosts } from "../services/apiHandler";

const Content = () => {
  const [posts, setPosts] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const getData = async () => {
    try {
      const res = await getAllPosts();
      if (res.status === 200) {
        setPosts(res.data);
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    getData();
  }, [refetch]);
  console.log(posts);
  return (
    <>
      <div className="container mx-auto mt-6 px-2 min-h-screen">
        <section className="flex lg:pl-14 lg:pr-20  px-6 flex-col justify-center md:flex-row mt-6">
          <LeftSide />
          <Main posts={posts} setRefetch={setRefetch} />
          <RightSide />
        </section>
      </div>
    </>
  );
};

export default Content;
