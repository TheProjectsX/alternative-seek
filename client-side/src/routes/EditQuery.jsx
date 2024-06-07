import { Button, Spinner } from "flowbite-react";
import { useContext, useEffect, useId, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import UserDataContext from "../context/context";
import { toast } from "react-toastify";

const EditQuery = () => {
  const context = useContext(UserDataContext);
  const { userAuthData } = context;

  const currentQuery = useLoaderData();
  const { queryId } = useParams();
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryId && currentQuery.success) {
      const form = formRef.current;
      form.title.defaultValue = currentQuery.queryTitle;
      form.name.defaultValue = currentQuery.productName;
      form.brand.defaultValue = currentQuery.productBrand;
      form.image.defaultValue = currentQuery.productImageURL;
      form.reason.defaultValue = currentQuery.boycottingReasonDetails;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    const queryTitle = form.title.value;
    const productName = form.name.value;
    const productBrand = form.brand.value;
    const productImageURL = form.image.value;
    const boycottingReasonDetails = form.reason.value;
    const userEmail = userAuthData.email;
    const userName = userAuthData.displayName;
    const userImage = userAuthData.photoURL;
    const recommendationCount = 0;
    const dateTime = new Date().toJSON();

    const currentQueryData = {
      queryTitle,
      productName,
      productBrand,
      productImageURL,
      boycottingReasonDetails,
      userEmail,
      userName,
      userImage,
      recommendationCount,
      dateTime,
    };

    if (queryId && currentQuery.success) {
      // Update
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/queries/${currentQuery._id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(currentQueryData),
          }
        );
        const serverResponse = await res.json();
        if (serverResponse.success) {
          toast.success("Query Updated Successfully!");
        } else {
          toast.error(serverResponse.message);
        }
      } catch (error) {
        toast.error("Failed to Update Query!");
        console.error(error);
      }
    } else {
      // Add New
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/queries`, {
          method: "POST",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(currentQueryData),
        });
        const serverResponse = await res.json();
        if (serverResponse.success) {
          toast.success("Query Added Successfully!");
          navigate(`/query-details/${serverResponse.insertedId}`);
          form.reset();
        } else {
          toast.error(serverResponse.message);
        }
      } catch (error) {
        toast.error("Failed to Add Query!");
        console.error(error);
      }
    }

    setLoading(false);
  };

  if (queryId && !currentQuery.success) {
    return (
      <div className="pb-10 dark:text-gray-100">
        <Helmet>
          <title>Query not Found | Alternative Seek</title>
        </Helmet>
        <h3 className="mb-8 text-2xl font-lato font-semibold p-5 w-full dark:bg-gray-800 text-center border-b-2 border-gray-400 dark:border-gray-500">
          Edit Query Item
        </h3>
        <div className="text-2xl text-center font-lato font-semibold italic">
          Query Not Found!
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 dark:text-gray-100">
      <Helmet>
        <title>
          {queryId ? "Edit Query Item" : "Add New Query"} | Alternative Seek
        </title>
      </Helmet>
      <h3 className="mb-4 text-2xl font-lato font-semibold p-5 w-full dark:bg-gray-800 text-center border-b-2 border-gray-400 dark:border-gray-500">
        {queryId ? "Edit Query Item" : "Add New Query"}
      </h3>

      <h4 className="text-2xl font-semibold text-center underline underline-offset-4 mb-8">
        {queryId ? "Edit the form Below!" : "Fill the form Below!"}
      </h4>

      {/* Data Form */}
      <form
        className="px-2 sm:px-8 space-y-5"
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col md:flex-row gap-5 *:flex-grow">
          <div>
            <label className="block text-sm font-medium dark:text-white">
              Title <span className="text-red-600">*</span>
              <input
                type="text"
                name="title"
                className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                placeholder="Your Query Title..."
                required
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-white">
              Product Name <span className="text-red-600">*</span>
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
              Product Brand <span className="text-red-600">*</span>
              <input
                type="text"
                name="brand"
                className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                placeholder="Your Product Brand..."
                required
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-white">
              Product Image URL <span className="text-red-600">*</span>
              <input
                type="text"
                name="image"
                className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                placeholder="https://imgbb.com/xxxxx"
                required
              />
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-white">
            Boycott Reason <span className="text-red-600">*</span>
            <input
              type="text"
              name="reason"
              className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
              placeholder="Reason for Seeking Alternative..."
              required
            />
          </label>
        </div>

        <div className="pt-5">
          <Button color="blue" className="w-full" type="submit" pill>
            {loading ? (
              <Spinner aria-label="Data Loading" className="dark:text-white" />
            ) : queryId ? (
              "Update Query"
            ) : (
              "Add Query"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditQuery;
