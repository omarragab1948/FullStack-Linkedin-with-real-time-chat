"use client";
import { useSelector } from "react-redux";
import LeftSide from "../components/LeftSide";
import Main from "../components/Main";
import RightSide from "../components/RightSide";

const Content = () => {
  const user = useSelector((state) => state.auth);
  const mode = user?.user?.user?.mode;

  return (
    <>
      <div className="min-h-screen mx-auto mt-6 relative  px-2 ">
        <section
          className={`${mode} flex lg:pl-14 lg:pr-20 relative px-6 flex-col justify-center md:flex-row mt-6`}
        >
          <LeftSide />
          <Main />
          <RightSide />
        </section>
      </div>
    </>
  );
};

export default Content;
