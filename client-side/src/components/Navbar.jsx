import {
  Avatar,
  Button,
  DarkThemeToggle,
  Dropdown,
  Navbar,
  Spinner,
} from "flowbite-react";
import { Link, NavLink } from "react-router-dom";
import UserDataContext from "../context/context";
import { useContext } from "react";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import auth from "../firebase/config";

const NavbarComponent = () => {
  const context = useContext(UserDataContext);
  const { userAuthData, dataLoading } = context;
  console.log(userAuthData);

  // Logout User
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, {
          credentials: "include",
        });
        toast.success("Logout Successful");
      })
      .catch((error) => console.log(error));
  };

  return (
    <Navbar className="mb-5" fluid rounded>
      <Navbar.Brand>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Alternative Seek
        </span>
      </Navbar.Brand>
      <div className="flex gap-5 md:order-2">
        <DarkThemeToggle className="hidden sm:block" />
        {dataLoading ? (
          <div className="flex items-center">
            <Spinner aria-label="Loading Data" />
          </div>
        ) : userAuthData ? (
          <div className="flex justify-center md:order-2">
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img={userAuthData.photoURL}
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  {userAuthData.displayName}
                </span>
                <span className="block truncate text-sm font-medium">
                  {userAuthData.email ?? "No Email to Show"}
                </span>
              </Dropdown.Header>
              <Link to="/update-profile">
                <Dropdown.Item>Edit Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown>
          </div>
        ) : (
          <Link to={"/login"}>
            <Button color={"blue"}>Login</Button>
          </Link>
        )}
        <Navbar.Toggle className="md:inline-flex lg:hidden" />
      </div>
      <Navbar.Collapse className="md:hidden lg:block [&_a]:text-gray-700 dark:[&_a]:text-gray-400 hover:[&_a]:text-[#1c64f2] dark:hover:[&_a]:text-white [&_.active]:text-[#1c64f2] [&_.active]:dark:text-white">
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/queries"}>Queries</NavLink>
        {userAuthData && (
          <>
            <NavLink to={"/me/recommendations-for-me"}>
              Recommendations For Me
            </NavLink>
            <NavLink to={"/me/queries"}>My Queries</NavLink>
            <NavLink to={"/me/recommendations"}>
              My Recommendations
            </NavLink>{" "}
          </>
        )}
        <DarkThemeToggle className="sm:hidden" />
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
