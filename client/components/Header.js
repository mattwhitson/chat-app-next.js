import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import {
  LightBulbIcon,
  LogoutIcon,
  MenuIcon,
  MoonIcon,
} from "@heroicons/react/outline";
import userService from "../services/userService";
import Cookies from "js-cookie";
import ChatSidebar from "./ChatSidebar";

const Header = ({ darkMode, setDarkMode }) => {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);
  const [openSidebar, setOpenSidebar] = useState(false);

  const logout = () => {
    Cookies.remove("user");
    setUser(null);
    userService
      .logout(user)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
    router.push("/account/login");
  };

  const path = router.asPath.split("/");

  return (
    <>
      <div className="flex w-full h-14 md:h-20 bg-gray-300 dark:bg-gray-900">
        <div className="flex justify-between lg:max-w-7xl w-full mx-auto">
          <h1
            className="hidden sm:inline-block text-xl md:text-2xl lg:text-4xl my-auto pb-1 lg:pb-2 font-semibold hover:cursor-pointer dark:text-gray-300"
            onClick={() => router.push("/")}
          >
            Matt's Messenger
          </h1>
          <div className="flex flex-col justify-center items-center ml-2 dark:text-gray-300">
            <MenuIcon
              className="h-6 sm:hidden"
              onClick={() => setOpenSidebar(true)}
            />
          </div>
          <div className="flex h-full items-center">
            <nav className="items-center">
              <div className="text-lg space-x-2 dark:text-gray-300">
                <Link href="/">
                  <a
                    className={`${
                      router.asPath === "/" && "border-b-[5px] border-blue-500"
                    }`}
                  >
                    Home
                  </a>
                </Link>

                <a
                  className={`${
                    router.asPath === `/chat/${path[2]}` &&
                    "border-b-[5px] border-blue-500"
                  }`}
                >
                  Chats
                </a>
              </div>
            </nav>

            {user ? (
              <div
                onClick={logout}
                className="flex items-center ml-2 hover:cursor-pointer dark:text-gray-300"
              >
                <button className="text-xl">Log out</button>
                <LogoutIcon className="ml-1 mt-1 h-6 w-6" />
              </div>
            ) : (
              <></>
            )}
            <MoonIcon
              onClick={() => setDarkMode(false)}
              className={`h-12 bg-gray-800 text-white active:bg-gray-600 active:border-gray-500 rounded p-4 mx-2 ${
                !darkMode && "hidden"
              }`}
            />
            <LightBulbIcon
              onClick={() => setDarkMode(true)}
              className={`h-12 bg-[#f7f7f7] rounded p-4 mx-2 active:bg-blue-200 active:border-2 active:border-blue-500 
              ${darkMode && "hidden"}
             `}
            />
          </div>
        </div>
      </div>
      <ChatSidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
    </>
  );
};

export default Header;
