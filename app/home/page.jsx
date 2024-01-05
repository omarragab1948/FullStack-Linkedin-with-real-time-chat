//
import LeftSide from "../components/LeftSide";
import Main from "../components/Main";
import RightSide from "../components/RightSide";

const Content = () => {
  return (
    <>
      <div className="container mx-auto mt-6 px-2 min-h-screen">
        <section className="flex lg:pl-14 lg:pr-20  px-6 flex-col justify-center md:flex-row mt-6">
          <LeftSide />
          <Main />
          <RightSide />
        </section>
      </div>
    </>
  );
};

export default Content;
