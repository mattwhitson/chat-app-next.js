import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { UserContext } from "../contexts/UserContext";

import { SocketContext, socket } from "../contexts/SocketContext";

function MyApp({ Component, pageProps }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user?._id) {
      socket.emit("addUser", user._id);
      socket.on("getUsers", (users) => {});
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthenticated(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Cookies.get("user") && user === null) {
      setUser(JSON.parse(Cookies.get("user")));
    }
  }, [user]);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in

    const publicPaths = ["/account/login", "/account/register"];
    const path = url.split("?")[0];
    if (!Cookies.get("user") && !publicPaths.includes(path)) {
      setAuthenticated(false);
      router.push({
        pathname: "/account/login",
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthenticated(true);
    }
  }

  return (
    <UserContext.Provider value={[user, setUser]}>
      <SocketContext.Provider value={socket}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SocketContext.Provider>
    </UserContext.Provider>
  );
}

export default MyApp;
