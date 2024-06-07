import { Helmet } from "react-helmet";
import Slider from "../components/Slider";

import bannerImage from "../assets/image_01.gif";
import { Avatar, Button, Card, List } from "flowbite-react";
import { Link, useLoaderData } from "react-router-dom";

// React Icons
import { RiTimeFill } from "react-icons/ri";
import { FaLongArrowAltRight } from "react-icons/fa";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

// Lottie
import Lottie from "lottie-react";
import computerAnimation from "../assets/computer-animation.json";

// React Toastify
import { toast } from "react-toastify";

const Home = () => {
  let [queriesData, tipsNGuidesData] = useLoaderData();
  queriesData = queriesData.result;

  return (
    <main className="space-y-16 py-6">
      <Helmet>
        <title>Alternative Seek</title>
      </Helmet>
      <Slider />

      {/* Header Banner */}
      <section className="relative">
        <div className="relative">
          <img src={bannerImage} alt="Banner" className="w-full mb-6 sm:mb-0" />
          <div className="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-30"></div>
          <h3 className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] sm:top-10 sm:left-0 sm:translate-x-0 sm:translate-y-0 text-center w-full text-3xl md:text-5xl font-lato font-bold text-white">
            Can't Make Your Decision?
          </h3>
        </div>
        <div className="sm:absolute bottom-10 flex flex-col items-center gap-5 w-full">
          <p className="text-xl font-semibold sm:text-white dark:text-white">
            Choose Your Option from Our Updated Query List!
          </p>
          <Link to={"/queries"}>
            <Button color={"blue"}>View Queries</Button>
          </Link>
        </div>
      </section>

      {/* Recent Queries */}
      <section className="dark:text-gray-100">
        <h3 className="text-2xl font-lato font-bold mb-3 text-center underline underline-offset-4">
          Recent Queries
        </h3>
        <p className="max-w-lg mx-auto mb-10 text-center">
          Stay updated on latest product queries. Explore alternatives suggested
          by the community.
        </p>

        <div className="flex flex-wrap gap-5 justify-evenly">
          {queriesData.map((item) => (
            <div
              key={item._id}
              className="max-w-[320px] h-[620px] rounded-md p-2 border-2 border-gray-700 dark:bg-gray-700 dark:text-gray-200 relative"
            >
              <div className="w-[303px] h-[206px] mb-4 overflow-hidden flex justify-center items-center bg-slate-400 dark:bg-slate-600">
                <img
                  src={item.productImageURL}
                  alt={item.productName}
                  className="w-full h-[206px] object-contain hover:scale-125 transition-[transform] duration-300"
                />
              </div>
              <p className="text-xl font-lato font-semibold text-center mb-4">
                {item.queryTitle}
              </p>
              <h3>
                <span className="font-semibold">Product:</span>{" "}
                {item.productName}
              </h3>
              <p>
                <span className="font-semibold">Brand:</span>{" "}
                {item.productBrand}
              </p>
              <p className="pl-4 border-l-4 border-gray-300 my-3">
                {item.boycottingReasonDetails}
              </p>
              <p className="flex gap-2 items-center mb-5">
                <RiTimeFill /> {new Date(item.dateTime).toLocaleString()}
              </p>

              <div className="flex items-center justify-center gap-2 font-semibold text-lg mb-4">
                <Avatar img={item.userImage} rounded />
                <p>{item.userName}</p>
              </div>

              <div className="flex justify-center absolute bottom-4 left-[50%] -translate-x-[50%] w-max">
                <Link
                  to={`/query-details/${item._id}`}
                  className="flex items-center"
                >
                  <Button color={"blue"}>
                    View Recommendations{" "}
                    <FaLongArrowAltRight className="ml-3 text-2xl" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips and Guides */}
      <section className="dark:text-gray-100">
        <h3 className="text-2xl font-lato font-bold mb-3 text-center underline underline-offset-4">
          Tips & Guides
        </h3>
        <p className="max-w-lg mx-auto mb-10 text-center">
          Practical tips for sustainable living. From eco-friendly cleaning to
          ethical shopping, discover actionable advice.
        </p>

        {/* Items */}
        <div className="grid md:grid-cols-2 gap-5">
          {tipsNGuidesData.map((item) => (
            <Card key={item._id} className="">
              <h4 className="text-xl font-semibold font-lato mb-4 text-center">
                {item.title}
              </h4>
              <List>
                {item.tips.map((tip, idx) => (
                  <List.Item
                    key={idx}
                    icon={MdOutlineKeyboardDoubleArrowRight}
                    className="text-gray-700 dark:text-gray-200"
                  >
                    {tip}
                  </List.Item>
                ))}
              </List>
            </Card>
          ))}
        </div>
      </section>

      {/* User Thoughts */}
      <section>
        <h3 className="text-2xl font-lato font-bold mb-3 text-center underline underline-offset-4 dark:text-white">
          Your Thoughts
        </h3>
        <p className="max-w-lg mx-auto mb-4 text-center dark:text-gray-200">
          Let us Know your thoughts about Our Service. Every Suggestion is
          Welcomed!
        </p>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/2">
            <Lottie animationData={computerAnimation} />
          </div>
          <form
            className="w-full md:w-auto md:flex-grow space-y-4 md:space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.target.reset();
              toast.success("Thanks for your Feedback!");
            }}
          >
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl dark:text-white text-center underline underline-offset-8 mb-10">
              Tell Us Your Thoughts
            </h1>
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Your Email <span className="text-red-600">*</span>
                <input
                  type="email"
                  name="email"
                  className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                  placeholder="name@company.com"
                  required
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Message Title <span className="text-red-600">*</span>
                <input
                  type="text"
                  name="title"
                  className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                  placeholder="Your Title Here..."
                  required
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Your Message <span className="text-red-600">*</span>
                <textarea
                  name="message"
                  className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                  placeholder="Your Message Here..."
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              name="submit"
              className="w-full text-white bg-blue-500 hover:bg-blue-600 dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;
