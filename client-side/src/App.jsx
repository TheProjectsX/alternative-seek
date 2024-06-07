// Components
import UserDataContext from "./context/context";
import NavbarComponent from "./components/Navbar";
import FooterComponent from "./components/Footer";
import { Outlet } from "react-router-dom";

// React Toast
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Swiper
import { register } from "swiper/element/bundle";
register();

// Firebase Auth
import { onAuthStateChanged } from "firebase/auth";
import auth from "./firebase/config";
import { useEffect, useReducer, useState } from "react";

function App() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [dataLoading, setDataLoading] = useState(true);
  const [userAuthData, setUserAuthData] = useState(null);

  // Auth Change Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user === null || user?.photoURL !== null) {
        setDataLoading(false);
        setUserAuthData(user);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="max-w-[1100px] mx-auto font-ubuntu shadow-2xl">
        <UserDataContext.Provider
          value={{
            userAuthData,
            setUserAuthData,
            dataLoading,
            setDataLoading,
            forceUpdate,
          }}
        >
          <NavbarComponent />
          <div className="px-4 mb-5 bg-white dark:bg-gray-800">
            <Outlet />
          </div>
          <FooterComponent />
        </UserDataContext.Provider>
      </div>
    </>
  );
}

export default App;
