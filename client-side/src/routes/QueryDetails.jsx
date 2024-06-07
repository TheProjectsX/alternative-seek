import { Avatar, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Helmet } from "react-helmet";
import { FaLongArrowAltRight } from "react-icons/fa";
import { RiTimeFill } from "react-icons/ri";
import { Link, useLoaderData } from "react-router-dom";
import UserDataContext from "../context/context";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const QueryDetails = () => {
  const [queryData, queryRecommendationsMain] = useLoaderData();
  const [queryRecommendations, setQueryRecommendations] = useState(
    queryRecommendationsMain
  );
  const context = useContext(UserDataContext);
  const { userAuthData } = context;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const title = form.title.value;
    const productName = form.name.value;
    const productImageURL = form.name.value;
    const reason = form.name.value;
    const queryId = queryData._id;
    const queryTitle = queryData.queryTitle;
    const queryProductName = queryData.productName;
    const userEmail = queryData.userEmail;
    const userName = queryData.userName;
    const recommenderUserEmail = userAuthData.email;
    const recommenderUserName = userAuthData.displayName;
    const dateTime = new Date().toJSON();

    const recommendationData = {
      title,
      productName,
      productImageURL,
      reason,
      queryId,
      queryTitle,
      queryProductName,
      userEmail,
      userName,
      recommenderUserEmail,
      recommenderUserName,
      dateTime,
    };

    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/recommendations`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(recommendationData),
      }
    );
    const serverResponse = await res.json();

    if (serverResponse.success) {
      setQueryRecommendations([
        ...queryRecommendations,
        { _id: serverResponse.insertedId, ...recommendationData },
      ]);
      toast.success("Recommendation Added Successfully!");
      form.reset();
    } else {
      toast.error(serverResponse.message);
    }

    setLoading(false);
  };

  if (!queryData.success) {
    return (
      <div className="pb-10 dark:text-gray-100">
        <Helmet>
          <title>Queries Details | Alternative Seek</title>
        </Helmet>
        <h3 className="mb-8 text-2xl font-lato font-semibold p-5 w-full dark:bg-gray-800 text-center border-b-2 border-gray-400 dark:border-gray-500">
          Query Details
        </h3>

        <div className="text-2xl text-center py-5 font-lato font-semibold italic">
          Query Not Found!
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 dark:text-gray-100">
      <Helmet>
        <title>Queries Details | Alternative Seek</title>
      </Helmet>
      <h3 className="mb-8 text-2xl font-lato font-semibold p-5 w-full dark:bg-gray-800 text-center border-b-2 border-gray-400 dark:border-gray-500">
        Query Details
      </h3>

      {/* About Query */}
      <div className="flex gap-6 flex-col md:flex-row mb-4">
        {/* Query Details */}
        <div className="gap-6 rounded-md p-4 border-2 border-gray-700 dark:bg-gray-700 dark:text-gray-200 relative md:w-3/5 h-min">
          <div
            className={`mb-4 overflow-hidden flex justify-center items-center bg-slate-400 dark:bg-slate-600`}
          >
            <img
              src={queryData.productImageURL}
              alt={queryData.productName}
              className="w-full"
            />
          </div>
          <div>
            <p className="text-2xl font-lato font-semibold mb-4">
              {queryData.queryTitle}
            </p>
            <h3>
              <span className="font-semibold">Product:</span>{" "}
              {queryData.productName}
            </h3>
            <p>
              <span className="font-semibold">Brand:</span>{" "}
              {queryData.productBrand}
            </p>
            <p>
              <span className="font-semibold">Recommendations:</span>{" "}
              {queryData.recommendationCount}
            </p>
            <p className="pl-4 border-l-4 border-gray-300 my-3">
              {queryData.boycottingReasonDetails}
            </p>
            <p className="flex gap-2 items-center mb-5">
              <RiTimeFill /> {new Date(queryData.dateTime).toLocaleString()}
            </p>

            <div className="flex items-center gap-6">
              <span className="text-xl font-semibold font-lato">Author:</span>
              <div className="flex items-center gap-2 font-semibold text-lg">
                <Avatar img={queryData.userImage} />
                <p>{queryData.userName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="flex-grow p-4 rounded-lg border-2 border-gray-700 dark:bg-gray-700 dark:text-gray-200 md:w-2/5">
          <h4 className="text-xl font-semibold font-lato text-center p-3 bg-blue-400 text-white dark:bg-gray-600 border-b-2 border-blue-800 dark:border-gray-400 mb-5">
            Recommendations
          </h4>

          <div className="space-y-3">
            {queryRecommendations.length === 0 ? (
              <div className="text-center p-5 font-semibold">
                No Recommendations to Show!
              </div>
            ) : (
              queryRecommendations.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 p-3 border border-gray-400 bg-gray-100 shadow-lg dark:bg-slate-700 dark:text-white"
                >
                  <div className="w-full min-w-24">
                    <img src={item.productImageURL} alt={item.productName} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg underline underline-offset-2">
                      {item.title}
                    </h3>
                    <h4>
                      <span className="font-semibold italic">Product:</span>{" "}
                      {item.productName}
                    </h4>
                    <p className="mb-3">
                      <span className="font-semibold italic">Reason:</span>{" "}
                      {item.reason}
                    </p>
                    <p className="flex gap-2 items-center">
                      <RiTimeFill /> {new Date(item.dateTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add New Recommendations */}
      <div className="border-2 border-gray-700 dark:bg-gray-700 dark:text-gray-200 p-4">
        <h4 className="text-xl sm:text-2xl font-bold font-lato mb-6 underline underline-offset-4">
          Add New Recommendation!
        </h4>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-5 *:flex-grow">
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Title
                <input
                  type="text"
                  name="title"
                  className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                  placeholder="Your Recommendation Title..."
                  required
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Product Name
                <input
                  type="text"
                  name="name"
                  className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                  placeholder="Product Name here..."
                  required
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5 *:flex-grow">
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Product Brand
                <input
                  type="text"
                  name="brand"
                  className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                  placeholder="Product Brand here..."
                  required
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Recommendation Reason
                <input
                  type="text"
                  name="reason"
                  className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                  placeholder="Recommendation Reason here..."
                  required
                />
              </label>
            </div>
          </div>

          <Button
            color="blue"
            className={`w-full ${
              userAuthData === null ? "cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={userAuthData === null}
            pill
          >
            {loading ? (
              <Spinner aria-label="Data Loading" className="dark:text-white" />
            ) : userAuthData ? (
              "Add Recommendation"
            ) : (
              "Login to Add Recommendations"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default QueryDetails;
