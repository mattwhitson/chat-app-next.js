import { PlusIcon } from "@heroicons/react/outline";
import { useContext, useEffect, useState } from "react";
import chatService from "../services/chatService";
import userService from "../services/userService";

import { SocketContext } from "../contexts/SocketContext";
import { UserContext } from "../contexts/UserContext";
import ChatTile from "./ChatTile";

const ChatSidebar = ({ openSidebar, setOpenSidebar }) => {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [user] = useContext(UserContext);

  const socket = useContext(SocketContext);

  //socket listening for newly added chat, if new chat refetch all chats
  useEffect(() => {
    socket.on("getChat", (data) => {
      console.log(data);
      chatService
        .getChats(user)
        .then((response) => {
          setChats(response.data);
        })
        .catch((err) => console.log(err.response.data.message));
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) {
      socket.on("updateChats", (data) => {
        chatService
          .getChats(user)
          .then((response) => {
            setChats(response.data);
          })
          .catch((err) => console.log(err));
      });
    }
    // eslint-disable-next-line
  }, [user]);

  //fetch chats on initial render
  useEffect(() => {
    if (user) {
      chatService
        .getChats(user)
        .then((response) => {
          setChats(response.data);
        })
        .catch((err) => console.log(err.response.data.message));
    }
    // eslint-disable-next-line
  }, [user]);

  const createChat = async (event) => {
    event.preventDefault();
    if (search === "") return;

    console.log(search);

    const newChat = {
      username: user.username,
      friend: search,
    };

    console.log(newChat);

    await chatService
      .createChat(newChat)
      .then((response) => {
        setReceiverId(response._id);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setError(err.response.data.message);
        setTimeout(() => {
          setError(null);
        }, 5000);
      });

    await chatService
      .getChats(user)
      .then((response) => {
        setChats(response.data);
      })
      .catch((err) => console.log(err.response.data.message));

    await userService
      .getUser(newChat.username, user)
      .then((response) => setReceiverId(response.data._id))
      .catch((err) => console.log(err.response.data.message));

    socket.emit("createChat", {
      username: user?.username,
      receiverId,
    });

    setReceiverId(null);
    setSearch("");
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 transition-opacity h-full w-full bg-black opacity-75 z-20 sm:hidden ${
          !openSidebar && "hidden"
        }`}
        onClick={() => setOpenSidebar(false)}
      ></div>
      <div
        className={`transform top-0 left-0 w-3/4 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 -translate-x-full sm:hidden dark:bg-gray-800 dark:text-white ${
          openSidebar && "translate-x-0"
        }`}
      >
        <PlusIcon
          onClick={() => setOpenSidebar(false)}
          className="absolute top-2 right-2 rounded h-8 rotate-45 active:bg-teal-700"
        />

        <div className="flex flex-col space-y-4">
          {error && (
            <div className="absolute flex w-full justify-center top-0 left-0">
              <div className="relative text-red-500 text-xs mt-1">{error}</div>
            </div>
          )}
          <form onSubmit={createChat}>
            <input
              className="mt-3 w-3/4 focus:outline-1 outline-blue-500 rounded-sm ml-2 mb-2 dark:text-black"
              placeholder="Search"
              onChange={({ target }) => setSearch(target.value)}
            />
            <button type="submit" hidden></button>
          </form>
          {chats &&
            chats.map((chat) => (
              <ChatTile
                key={chat._id}
                chat={chat}
                setOpenSidebar={setOpenSidebar}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
