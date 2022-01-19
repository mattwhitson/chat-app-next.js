import Head from "next/head";
import { useContext, useEffect } from "react";

import ChatSidebar from "../components/ChatSidebar";
import Profile from "../components/Profile";
import { SocketContext } from "../contexts/SocketContext";

export const getServerSideProps = (context) => {
  const user = context.req.cookies.user
    ? JSON.parse(context.req.cookies.user)
    : "";

  return {
    props: {
      user: user,
    },
  };
};

export default function Home({ user }) {
  const socket = useContext(SocketContext);

  return (
    <>
      <Head>
        <title>Matt&apos;s Chat App</title>
        <meta property="og:title" content="Matt's Chat App" key="title" />
        <meta
          property="og:description"
          content="A simple chat app I made to practice and learn new skills, hope you enjoy!"
          key="description"
        />
      </Head>
      <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] w-full bg-[#f7f7f7] dark:text-white dark:bg-gray-800">
        <Profile user={user} />
      </div>
    </>
  );
}
